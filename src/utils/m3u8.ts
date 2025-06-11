import axios from 'axios';
import aesjs from 'aes-js'
import { Buffer } from 'buffer'

export const VIDEO_EXT = '.ts'
const PNG_EXT = '.png'
const BMP_EXT = '.bmp'
const M4S_EXT = '.m4s'
const JPG_EXT = '.jpg'

export type Enc = { key: Buffer, iv: string } | null

export const loadVideoChunks = async (url: string): Promise<[string[], Enc]> => {
    if (!url.includes('.m3u8')) {
        return [[url], null]
    }

    const res = await axios.get(url)

    if ((res.data).includes('m3u8')) {
        const lines: string[] = res.data.split('\n')
        let m3u8 = lines.find(l => l.includes('m3u8'))
        if (!m3u8) {
            return [[url], null]
        }

        if (!(m3u8.startsWith('http://') || m3u8.startsWith('https://'))) {
            m3u8 = getUrl(url, m3u8)
        }
        return loadVideoChunks(m3u8)
    }

    const lines: string[] = res.data.split('\n')

    let enc: Enc = null
    const files: string[] = []
    for (const line of lines) {
        if (line.startsWith('#EXT-X-KEY')) {
            let iv = '0x00000000000000000000000000000000'
            const ivRegex = /IV=([^,]+)/;
            const ivMatch = line.match(ivRegex);
            if (ivMatch) {
                iv = ivMatch[1]
            }

            let keyUrl = line.split('URI="')[1]
            keyUrl = keyUrl.split('"')[0]

            if (!(keyUrl.startsWith('http://') || keyUrl.startsWith('https://'))) {
                keyUrl = getUrl(url, keyUrl)
            }
            const res = await axios.get(keyUrl, {
                responseType: 'arraybuffer'
            })
            enc = {
                key: Buffer.from(res.data),
                iv
            }
        }

        if (
            line.endsWith(VIDEO_EXT) ||
            line.includes(VIDEO_EXT + "?") ||
            line.endsWith(PNG_EXT) ||
            line.includes(PNG_EXT + "?") ||
            line.endsWith(BMP_EXT) ||
            line.includes(BMP_EXT + "?") ||
            line.endsWith(JPG_EXT) ||
            line.includes(JPG_EXT + "?") ||
            line.endsWith(M4S_EXT) ||
            line.includes(M4S_EXT + "?")
        ) {
            if (line.startsWith('http://') || line.startsWith('https://')) {
                files.push(line)
            } else {
                const vidUrl = getUrl(url, line)
                files.push(vidUrl)
            }
        }
    }

    return [files, enc]
}

// decrypt aes-128
export const decrypt = (enc: Enc, encryptedBytes: string) => {
    const secretKey = enc!.key; // 128-bit key (16 bytes)
    const byteBuffer = Buffer.from(enc!.iv.slice(2), 'hex');

    const aesCbc = new aesjs.ModeOfOperation.cbc(
        secretKey,
        new Uint8Array(byteBuffer)
    );

    const decryptedBytes = aesCbc.decrypt(new Uint8Array(Buffer.from(encryptedBytes, 'base64')));
    return Buffer.from(decryptedBytes).toString('base64')
}

const getUrl = (oriPath: string, path: string) => {
    const urlObj = new URL(oriPath)
    const parts = urlObj.pathname.split('/').filter(p => p)
    parts.pop()
    const baseURL = oriPath.split(urlObj.pathname)[0] + '/' + parts.join('/')

    if (!path?.startsWith('/')) {
        return baseURL + '/' + path
    }

    return baseURL + path
}