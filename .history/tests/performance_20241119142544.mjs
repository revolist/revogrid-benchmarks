import { chromium } from "playwright"; // ESM import syntax

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  // Add initialization script
  await context.addInitScript(
    (data) => {
      window.preloadedData = data; // Inject data into the window object
    },
    { exampleKey: "exampleValue", rows: 100, columns: 100 }
  );
  const page = await browser.newPage();
  await page.goto("http://localhost:5174/ag");

  await page.waitForSelector(".ag-body-viewport");

  let fps = "0";
  try {
    // Measure FPS during scrolling
    fps = await page.evaluate(async () => {
      const element = document.querySelector(".ag-body-viewport");

      if (!(element instanceof HTMLElement)) {
        return "0";
      }

      let frameCount = 0;
      const scrollDuration = 2000; // Duration to scroll (in ms)
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
    });
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

  console.log(`Scroll FPS: ${fps}`);
  console.log(memoryUsage);

  await browser.close();
})();
