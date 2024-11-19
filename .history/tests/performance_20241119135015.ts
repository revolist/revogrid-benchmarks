const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5174/ag')

  console.log('AG-Grid')

  await browser.close()
})()