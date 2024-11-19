import { chromium } from "playwright"; // ESM import syntax

async function testPage(page, url, scrollSelector, firstCellSelector) {
  await page.goto(`http://localhost:5174/${url}`);

  // // Verify the data is injected
  // const data = await page.evaluate(() => window.rowsNumber);
  // console.log("Injected rows:", data);

  await page.waitForSelector('.page', {
    timeout: 160000,});
  
  // Start the timer
  const startTime = performance.now();

  // Wait for the selector to appear
  await page.waitForSelector(firstCellSelector, {
    timeout: 60000,
  });

  // Stop the timer
  const endTime = performance.now();

  // Calculate the elapsed time
  const firstCellTime = endTime - startTime;

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
    firstCellTime: `${firstCellTime.toFixed(2)} ms`
  });
}

(async () => {
  const browser = await chromium.launch({
    timeout: 600000,
  });

  const sets = [100000];
  for (let i = 0; i < sets.length; i++) {
    const context = await browser.newContext();

    // Inject data into the page before it loads
    await context.addInitScript(
      (data) => {
        window.rowsNumber = data.rows;
        window.colsNumber = data.columns;
      },
      { rows: sets[i], columns: 100 }
    );

    console.log(`Testing ${sets[i]} rows...`);
    try {
      await testPage(await context.newPage(), "ag", ".ag-body-viewport", '.ag-cell-value[col-id="0"]');
    } catch (error) {
      console.error('AG-Grid test failed for rows:', sets[i]);
    }
    try {
      await testPage(await context.newPage(), "ht", ".ht_master.handsontable > .wtHolder", '.ht_master.handsontable > .wtHolder td[role="gridcell"][aria-colindex="1"]');
    } catch (error) {
      console.error('Handsontable test failed for rows:', sets[i]);
    }
    try {
      await testPage(await context.newPage(), "rv", "revo-grid revogr-viewport-scroll.rgCol .vertical-inner", '.rgCell[data-rgcol="0"]');
    } catch (error) {
      console.error('RevoGrid test failed for rows:', sets[i]);
    }
  }

  await browser.close();
})();
