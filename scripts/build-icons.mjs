// 从 Mr Otto 的 app 图标出一套站点用的尺寸。
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = process.argv[2] ?? '/Users/stanyan/Github/Mr_Otto/resources/icon.png'
const OUT = path.join(process.cwd(), 'public')
const SIZES = [512, 192, 96, 48, 32]

await mkdir(OUT, { recursive: true })
for (const size of SIZES) {
  await sharp(SOURCE).resize(size, size, { kernel: 'lanczos3' }).png().toFile(path.join(OUT, `icon-${size}.png`))
}
await sharp(SOURCE).resize(180, 180, { kernel: 'lanczos3' }).png().toFile(path.join(OUT, 'apple-icon.png'))
console.log('icons written:', SIZES.join(', '), '+ apple-icon')
