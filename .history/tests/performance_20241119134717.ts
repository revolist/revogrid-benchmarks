import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:5174/ag');

  const fps = await page.evaluate(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const calculateFPS = () => {
      frameCount++;
      const now = performance.now();
      const delta = now - lastTime;

      if (delta >= 1000) { // Calculate FPS every second
        const fps = frameCount / (delta / 1000);
        frameCount = 0;
        lastTime = now;
        return fps;
      }

      requestAnimationFrame(calculateFPS);
    };

    requestAnimationFrame(calculateFPS);
  });

  console.log(`FPS: ${fps}`);

  await browser.close();
})();