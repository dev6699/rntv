import axios from 'axios';
import aesjs from 'aes-js'
import { Buffer } from 'buffer'

export const VIDEO_EXT = '.ts'
const PNG_EXT = '.png'
const BMP_EXT = '.bmp'

export const loadVideoChunks = async (url: string): Promise<[string[], string]> => {
    if (!url.includes('.m3u8')) {
        return [[url], '']
    }

    const res = await axios.get(url)

    if ((res.data as string).includes('m3u8')) {
        const lines: string[] = res.data.split('\n')
        let m3u8 = lines.find(l => l.includes('m3u8'))!

        if (!(m3u8!.startsWith('http://') || m3u8!.startsWith('https://'))) {
            const urlParts = url.split('/')
            const hostname = urlParts[0] + "//" + urlParts[2]
            if (!m3u8?.startsWith('/')) {
                const last = url.split('/')
                last.pop()
                m3u8 = last.join('/') + '/' + m3u8
            } else {
                m3u8 = hostname + m3u8
            }

        }
        return loadVideoChunks(m3u8)
    }

    const lines: string[] = res.data.split('\n')

    let key = ''
    const files: string[] = []
    const urlParts = url.split('/')
    urlParts.splice(urlParts.length - 1)
    const vidUrl = urlParts.join('/')
    for (const line of lines) {
        if (line.startsWith('#EXT-X-KEY')) {
            let keyUrl = line.split('URI="')[1]
            keyUrl = keyUrl.split('"')[0]

            if (!(keyUrl!.startsWith('http://') || keyUrl!.startsWith('https://'))) {
                const urlParts = url.split('/')
                const hostname = urlParts[0] + "//" + urlParts[2]
                if (keyUrl.startsWith('/')) {
                    keyUrl = hostname + keyUrl
                } else {
                    urlParts.pop()
                    const baseUrl = urlParts.join('/')
                    keyUrl = baseUrl + '/' + keyUrl
                }
            }
            const res = await axios.get(keyUrl)
            key = res.data
        }

        if (
            line.endsWith(VIDEO_EXT) ||
            line.includes(VIDEO_EXT + "?") ||
            line.endsWith(PNG_EXT) ||
            line.includes(PNG_EXT + "?") ||
            line.endsWith(BMP_EXT) ||
            line.includes(BMP_EXT + "?")
        ) {
            if (line.startsWith('http://') || line.startsWith('https://')) {
                files.push(line)
            } else {
                const lineParts = line.split('/')
                const name = lineParts.pop()!
                let _line = line

                if (vidUrl.includes('//')) { }
                const _vidUrl = vidUrl.split('//').join('/')
                if (_vidUrl.includes(lineParts.join('/'))) {
                    _line = name
                }

                if (_line.startsWith('/')) {
                    files.push(_vidUrl + _line)
                } else {
                    files.push(_vidUrl + '/' + _line)
                }
            }
        }
    }
    return [files, key]
}

// decrypt aes-128
export const decrypt = (secret: string, encryptedBytes: string) => {
    const secretKey = secret; // 128-bit key (16 bytes)
    const iv = new Uint8Array(16); // 16-byte IV

    const aesCbc = new aesjs.ModeOfOperation.cbc(
        Buffer.from(secretKey),
        iv
    );

    const decryptedBytes = aesCbc.decrypt(new Uint8Array(Buffer.from(encryptedBytes, 'base64')));
    return Buffer.from(decryptedBytes).toString('base64')
}