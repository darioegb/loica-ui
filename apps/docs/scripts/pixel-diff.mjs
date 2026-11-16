// Two renders of the same page can differ in the anti-aliasing of a rounded corner, by one level of one channel, with
// nothing that changed on the page. That is noise of the rasterizer, so a picture counts as the same when the bytes
// are equal, or when only a few pixels differ and by very little. A change that is on purpose, such as a color, a
// border or a radius, touches more pixels or differs by more.
export const MAX_PIXELS = 100
export const MAX_DELTA = 2

export async function sameLook(page, before, after) {
  if (before.equals(after)) return true
  const { delta, pixels, size } = await page.evaluate(
    async ([first, second]) => {
      const decode = async (base64) => {
        const image = new Image()
        image.src = `data:image/png;base64,${base64}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0)
        return { data: context.getImageData(0, 0, image.width, image.height).data, height: image.height, width: image.width }
      }
      const [a, b] = await Promise.all([decode(first), decode(second)])
      if (a.width !== b.width || a.height !== b.height) return { delta: 255, pixels: Infinity, size: false }
      let pixels = 0
      let delta = 0
      for (let offset = 0; offset < a.data.length; offset += 4) {
        const largest = Math.max(
          Math.abs(a.data[offset] - b.data[offset]),
          Math.abs(a.data[offset + 1] - b.data[offset + 1]),
          Math.abs(a.data[offset + 2] - b.data[offset + 2]),
          Math.abs(a.data[offset + 3] - b.data[offset + 3]),
        )
        if (largest > 0) {
          pixels++
          delta = Math.max(delta, largest)
        }
      }
      return { delta, pixels, size: true }
    },
    [before.toString('base64'), after.toString('base64')],
  )
  return size && pixels <= MAX_PIXELS && delta <= MAX_DELTA
}
