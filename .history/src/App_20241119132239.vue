<template>
  <br />
  <div>
    <nav>
      <p>
      <router-link to="/ag">AG-Grid</router-link> |
      <router-link to="/ht">HandsonTable</router-link> |
      <router-link to="/rv">RevoGrid</router-link></p>
    </nav>
    <hr />
    <div>
      <div>
        <h3>Performance Metrics</h3>
        <p>Render Time: {{ renderTime }} ms</p>
        <p>Scroll FPS: {{ scrollFPS }}</p>
        <p>
          Memory Usage:
          {{
            memoryUsage ? `${memoryUsage.usedJSHeapSize.toFixed(2)} MB` : "N/A"
          }}
        </p>
      </div>
    </div>
    <router-view @fps="onScroll" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const renderTime = ref<number | null>(null);
const scrollFPS = ref<number | null>(null);
const memoryUsage = ref<{ usedJSHeapSize: number } | null>(null);

// onMounted(async () => {
//   watch(selectedGrid, (newGrid) => {
//     const start = performance.now();

//     // Calculate render time
//     setTimeout(() => {
//       const end = performance.now();
//       renderTime.value = end - start;
//     }, 0);
//   });
// });

// Scroll FPS measurement
let lastTimestamp = 0;
let frameCount = 0;
let isScrolling = false;

const calculateFPS = (timestamp: DOMHighResTimeStamp) => {
  frameCount++;
  if (timestamp - lastTimestamp >= 400000) {
    scrollFPS.value = frameCount;
    console.log(frameCount);
    frameCount = 0;
    lastTimestamp = timestamp;
  }
  if (isScrolling) requestAnimationFrame(calculateFPS);
};

const onScroll = () => {
  if (!isScrolling) {
    isScrolling = true;
    frameCount = 0;
    lastTimestamp = 0;
    requestAnimationFrame(calculateFPS);
  }
  clearTimeout((window as any)._scrollTimeout);
  (window as any)._scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 200);
};

// Memory measurement
setInterval(() => {
  // @ts-ignore
  if (performance.memory) {
    memoryUsage.value = {
      // @ts-ignore
      usedJSHeapSize: performance.memory.usedJSHeapSize / 1024 / 1024,
    };
  }
}, 5000);
</script>
