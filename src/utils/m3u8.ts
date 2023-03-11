import axios from 'axios';
import aesjs from 'aes-js'
import { Buffer } from 'buffer'

export const VIDEO_EXT = '.ts'
const PNG_EXT = '.png'
const BMP_EXT = '.bmp'

export const loadVideoChunks = async (url: string): Promise<[string[], boolean]> => {
    const res = await axios.get(url)

    if ((res.data as string).includes('m3u8')) {
        const lines: string[] = res.data.split('\n')
        let m3u8 = lines.find(l => l.includes('m3u8'))

        if (!(m3u8!.startsWith('http://') || m3u8!.startsWith('https://'))) {
            const urlParts = url.split('/')
            const hostname = urlParts[0] + "//" + urlParts[2]
            m3u8 = hostname + m3u8

            return loadVideoChunks(m3u8)
        }
    }

    const lines: string[] = res.data.split('\n')

    // let key = ''
    let encrypted = false
    const files: string[] = []
    const urlParts = url.split('/')
    urlParts.splice(urlParts.length - 1)
    const vidUrl = urlParts.join('/')
    for (const line of lines) {
        if (line.startsWith('#EXT-X-KEY')) {
            encrypted = true
            // TODO? handle stream with encryption
            // tested slow performance running decryption in JS, find a native solution?

            // let keyUrl = line.split('URI="')[1]
            // keyUrl = keyUrl.substring(0, keyUrl.length - 1)
            // const res = await axios.get(keyUrl)
            // key = res.data
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
                if (line.startsWith('/')) {
                    files.push(vidUrl + line)
                } else {
                    files.push(vidUrl + '/' + line)
                }
            }
        }
    }
    return [files, encrypted]
}

export const decrypt = (secret: string, encryptedBytes: string) => {
    const secretBuf = Buffer.from(secret)
    const aesCbc = new aesjs.ModeOfOperation.cbc(secretBuf, secretBuf);
    return aesCbc.decrypt(Buffer.from(encryptedBytes, 'base64'))
}
