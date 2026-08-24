// Trim transparent padding off the raw pixel-art PNGs, normalise them to a
// common height, and emit lossless webp under public/sprites/{left,right}.
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

// 用法：node scripts/build-sprites.mjs <向左走的目录> <向右走的目录>
// 不传参数就用下面这两个默认目录（原始 PNG 素材）。
const [leftSource, rightSource] = process.argv.slice(2)
const SOURCES = {
  left: leftSource ?? '/Users/stanyan/Downloads/left/transparent',
  right: rightSource ?? '/Users/stanyan/Downloads/right/transparent',
}
const OUT_ROOT = path.join(process.cwd(), 'public', 'sprites')
const TARGET_HEIGHT = 400 // 2x the 200px on-screen height

const manifest = {}

for (const [dir, source] of Object.entries(SOURCES)) {
  const outDir = path.join(OUT_ROOT, dir)
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const files = (await readdir(source)).filter((f) => f.toLowerCase().endsWith('.png')).sort()
  const frames = []

  for (const [i, file] of files.entries()) {
    const name = `${dir}-${i}.webp`
    const info = await sharp(path.join(source, file))
      .trim({ threshold: 1 })
      .resize({ height: TARGET_HEIGHT, kernel: 'nearest', fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ lossless: true })
      .toFile(path.join(outDir, name), )
    frames.push({ src: `/sprites/${dir}/${name}`, width: info.width, height: info.height })
  }

  manifest[dir] = frames
  console.log(dir, frames.length, 'frames', frames.map((f) => f.width).join(','))
}

await writeFile(path.join(process.cwd(), 'src', 'lib', 'sprites.json'), JSON.stringify(manifest, null, 2) + '\n')
