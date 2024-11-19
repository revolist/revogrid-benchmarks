const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5174/ag')

  console.log('AG-Grid')
  const renderTime = await page.evaluate(() => window.renderTime)
  const scrollFPS = await page.evaluate(() => window.scrollFPS)
  const memoryUsage = await page.evaluate(() => window.memoryUsage)
  console.log(`Render Time: ${renderTime} ms`)
  console.log(`Scroll FPS: ${scrollFPS}`)
  console.log(`Memory Usage: ${memoryUsage ? `${memoryUsage.usedJSHeapSize.toFixed(2)} MB` : "N/A"}`)

  await browser.close()
})()