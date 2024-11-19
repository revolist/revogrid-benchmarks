<template>
  <div>
    <h1>Performance Metrics Comparison</h1>
    <p>Select a grid to test:</p>
    <nav>
      <h2>Selected Grid: <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link></h2>
    </nav>
    <router-view />
  </div>
  <div>
    <div>
      <h2>Performance Metrics</h2>
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
  if (performance.memory) {
    memoryUsage.value = {
      usedJSHeapSize: performance.memory.usedJSHeapSize / 1024 / 1024,
    };
  }
}, 5000);
</script>
