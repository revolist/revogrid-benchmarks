import { chromium } from 'playwright'

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5174/ag')



  await browser.close()
})()