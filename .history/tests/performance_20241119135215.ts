import { chromium } from 'playwright'

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5174/ag')

  console.log('AG-Grid')
  
  // Collect performance metrics
  const performanceMetrics = await page.evaluate(() => JSON.stringify(window.performance));
  console.log('Performance Metrics:', performanceMetrics);

  await browser.close()
})()