<template>
  <div>
    <nav>
      <h2>Selected Grid: <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contact">Contact</router-link></h2>
    </nav>
    <router-view />
  </div>
  <div>
    <h1>Performance Metrics Comparison</h1>
    <p>Select a grid to test:</p>
    <select v-model="selectedGrid">
      <option value="ag-grid">AG Grid</option>
      <option value="handsontable">Handsontable</option>
      <option value="revogrid">RevoGrid</option>
    </select>

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
import { ref, onMounted, watch } from "vue";
import ColumnGeneratorWorker from "./columnGenerator.worker.ts?worker";

const renderTime = ref<number | null>(null);
const scrollFPS = ref<number | null>(null);
const memoryUsage = ref<{ usedJSHeapSize: number } | null>(null);


onMounted(async () => {
  await fetchData(100000);
  watch(selectedGrid, (newGrid) => {
    const start = performance.now();

    if (newGrid === "handsontable") {
      registerAllModules();
    }
    // Calculate render time
    setTimeout(() => {
      const end = performance.now();
      renderTime.value = end - start;
    }, 0);
  });
});

// Scroll FPS measurement
let lastTimestamp = 0;
let frameCount = 0;
let isScrolling = false;

// Fetch data for Handsontable
const fetchData = async (rows: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users?rows=${rows}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    const colsNumber = 100;

    rowData.value = await new Promise((resolve, reject) => {
      // Initialize the worker
      const worker = new ColumnGeneratorWorker();

      worker.onmessage = (event) => {
        resolve(event.data);
        worker.terminate(); // Cleanup
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        reject(error);
      };

      // Send data to the worker
      worker.postMessage({ rows: data, colsNumber });
    });
    const newColumnsDefs = [];
    const newColumns = [];
    for (let j = 0; j < colsNumber; j++) {
      newColumns.push({
        name: generateHeader(j),
        prop: j,
      });
      newColumnsDefs.push({
        field: j.toString(), // problem with non string prop
        headerName: generateHeader(j),
        minWidth: 100,
        maxWidth: 100,
      });
    }
    columnDefs.value.push(...newColumnsDefs);
    columns.value.push(...newColumns);
    // Transform data into Handsontable's array format
    htData.value = rowData.value.map((row: any) =>
      Object.values(row).map((value: any) => value)
    );
  } catch (error) {
    console.error("Error fetching data for Handsontable:", error);
  }
};

function generateHeader(index: number) {
  const asciiFirstLetter = 65;
  const lettersCount = 26;
  let div = index + 1;
  let label = "";
  let pos;
  while (div > 0) {
    pos = (div - 1) % lettersCount;
    label = String.fromCharCode(asciiFirstLetter + pos) + label;
    div = parseInt(((div - pos) / lettersCount).toString(), 10);
  }
  return label;
}

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

watch(
  selectedGrid,
  () => {
    setTimeout(() => {
      document
        .querySelector("revo-grid revogr-viewport-scroll.rgCol .vertical-inner")
        ?.addEventListener("scroll", onScroll);
      document
        .querySelector(".ag-body-viewport")
        ?.addEventListener("scroll", onScroll);
      document
        .querySelector(".ht_master.handsontable > .wtHolder")
        ?.addEventListener("scroll", onScroll);
    }, 1000);
  },
  { immediate: true }
);

// Memory measurement
setInterval(() => {
  if (performance.memory) {
    memoryUsage.value = {
      usedJSHeapSize: performance.memory.usedJSHeapSize / 1024 / 1024,
    };
  }
}, 5000);
</script>
