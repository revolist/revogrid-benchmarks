<template>
  <div>
    <h1>Performance Metrics Comparison</h1>
    <p>Select a grid to test:</p>
    <select v-model="selectedGrid">
      <option value="ag-grid">AG Grid</option>
      <option value="handsontable">Handsontable</option>
      <option value="revogrid">RevoGrid</option>
    </select>

    <div>
      <h2>Selected Grid: {{ selectedGrid }}</h2>
      <div v-if="selectedGrid === 'ag-grid'">
        <ag-grid-vue
          :rowData="rowData"
          :columnDefs="columnDefs"
          style="width: 100%; height: 400px"
        ></ag-grid-vue>
      </div>
      <div v-if="selectedGrid === 'handsontable'">
        <hot-table
          :data="htdata"
          licenseKey="non-commercial-and-evaluation"
          style="width: 100%; height: 400px"
        ></hot-table>
      </div>
      <div v-if="selectedGrid === 'revogrid'">
        <revo-grid
          :source="rowData"
          :columns="columnDefs"
          style="width: 100%; height: 400px"
        ></revo-grid>
      </div>
    </div>

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
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import { AgGridVue } from "ag-grid-vue3";
import RevoGrid from "@revolist/vue3-datagrid";


const selectedGrid = ref("ag-grid");
const renderTime = ref<number | null>(null);
const scrollFPS = ref<number | null>(null);
const memoryUsage = ref<{ usedJSHeapSize: number } | null>(null);

const rowData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Name ${i}`,
  age: Math.floor(Math.random() * 50) + 20,
  city: `City ${Math.floor(Math.random() * 10)}`,
}));

const htdata = [
  ["", "Ford", "Volvo", "Toyota", "Honda"],
  ["2016", 10, 11, 12, 13],
  ["2017", 20, 11, 14, 13],
  ["2018", 30, 15, 12, 13],
];

const columnDefs = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age" },
  { field: "city", headerName: "City" },
];

const columns = [
  { accessor: "id", header: "ID" },
  { accessor: "name", header: "Name" },
  { accessor: "age", header: "Age" },
  { accessor: "city", header: "City" },
];

let hotInstance: Handsontable | null = null;

onMounted(() => {
  watch(selectedGrid, (newGrid) => {
    const start = performance.now();
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

const calculateFPS = (timestamp: DOMHighResTimeStamp) => {
  frameCount++;
  if (timestamp - lastTimestamp >= 1000) {
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

watch(selectedGrid, () => {
  document.querySelector("#tanstack")?.addEventListener("scroll", onScroll);
  document.querySelector("#revogrid")?.addEventListener("scroll", onScroll);
  document
    .querySelector(".ag-root-wrapper")
    ?.addEventListener("scroll", onScroll);
});

// Memory measurement
setInterval(() => {
  if (performance.memory) {
    memoryUsage.value = {
      usedJSHeapSize: performance.memory.usedJSHeapSize / 1024 / 1024,
    };
  }
}, 5000);
</script>
