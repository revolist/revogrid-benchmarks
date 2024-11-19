import { chromium } from "playwright"; // ESM import syntax

async function testPage(page, url, scrollSelector) {
  await page.goto(`http://localhost:5174/${url}`);

  // // Verify the data is injected
  // const data = await page.evaluate(() => window.rowsNumber);
  // console.log("Injected rows:", data);

  await page.waitForSelector(scrollSelector);
  
  // Start the timer
  const startTime = performance.now();

  // Wait for the selector to appear
  await page.waitForSelector('.ag-cell-value[col-id="0"]');

  // Stop the timer
  const endTime = performance.now();

  // Calculate the elapsed time
  const firstCellTime = endTime - startTime;

  console.log(`First cell render time: ${firstCellTime.toFixed(2)} ms`);

  let fps = "0";
  try {
    // Measure FPS during scrolling
    fps = await page.evaluate(async (scrollSelector) => {
      const element = document.querySelector(scrollSelector);

      if (!(element instanceof HTMLElement)) {
        return "0";
      }

      let frameCount = 0;
      const scrollDuration = 1000; // Duration to scroll (in ms)
      let lastTimestamp = performance.now();

      const scrollPromise = new Promise((resolve) => {
        function calculateFPS(timestamp) {
          frameCount++;
          const elapsed = timestamp - lastTimestamp;

          if (elapsed >= scrollDuration) {
            const fps = frameCount / (elapsed / 1000);
            resolve(fps.toFixed(2));
          } else {
            window.requestAnimationFrame(calculateFPS);
          }
        }

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

        window.requestAnimationFrame(calculateFPS);
      });

      return scrollPromise;
    }, scrollSelector);
  } catch (error) {
    console.error(error);
  }

  const memoryUsage = await page.evaluate(() => {
    if ("memory" in performance) {
      return {
        usedJSHeapSize: (
          performance.memory.usedJSHeapSize /
          1024 /
          1024
        ).toFixed(2),
        totalJSHeapSize: (
          performance.memory.totalJSHeapSize /
          1024 /
          1024
        ).toFixed(2),
      };
    } else {
      return null;
    }
  });

  console.log(`${url} performance metrics:`);
  console.log({
    ...memoryUsage,
    scrollFPS: fps,
  });
}

(async () => {
  const browser = await chromium.launch();

  const context = await browser.newContext();

  // Inject data into the page before it loads
  await context.addInitScript(
    (data) => {
      window.rowsNumber = data.rows;
      window.colsNumber = data.columns;
    },
    { rows: 1000, columns: 100 }
  );

  const page = await context.newPage();
  await testPage(page, "ag", ".ag-body-viewport");
  // await testPage(page, "rv", "revo-grid revogr-viewport-scroll.rgCol .vertical-inner");
  await browser.close();
})();
