import { chromium } from 'playwright'

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://localhost:5174/ag')


  const element = await page.waitForSelector('.ag-body-viewport');

  try {
  // Measure FPS during scrolling
  const fps = await page.evaluate(async () => {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    let frameCount = 0;
    const scrollDuration = 2000; // Duration to scroll (in ms)
    let lastTimestamp = performance.now();

    const scrollPromise = new Promise((resolve) => {
      const calculateFPS = (timestamp) => {
        frameCount++;
        const elapsed = timestamp - lastTimestamp;

        if (elapsed >= scrollDuration) {
          const fps = frameCount / (elapsed / 1000);
          resolve(fps.toFixed(2));
        } else {
          requestAnimationFrame(calculateFPS);
        }
      };

      // Start the scrolling
      let scrollPosition = 0;
      const scrollStep = 50; // Pixels to scroll in each step
      const interval = setInterval(() => {
        scrollPosition += scrollStep;
        element.scrollTo(0, scrollPosition);

        if (scrollPosition >= element.scrollHeight - element.clientHeight) {
          clearInterval(interval);
        }
      }, 16); // ~60 FPS interval

      requestAnimationFrame(calculateFPS);
    });

    return scrollPromise;
  });
} catch (error) {
  console.error(error);
}

  console.log(`Scroll FPS: ${fps}`);

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