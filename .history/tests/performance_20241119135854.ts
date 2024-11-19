import { chromium } from 'playwright'

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5174/ag')


  await page.waitForSelector('.ag-body-viewport');

  const memoryUsage = await page.evaluate(() => {
    // @ts-ignore
    if (performance.memory) {
      return {
        // @ts-ignore
        usedJSHeapSize: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
        // @ts-ignore
        totalJSHeapSize: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2),
      };
    } else {
      return null;
    }
  });

  console.log(memoryUsage)

  await browser.close()
})()