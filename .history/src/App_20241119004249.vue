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
          style="width: 100%; height: 800px"
        ></ag-grid-vue>
      </div>
      <div v-if="selectedGrid === 'handsontable'">
        <hot-table
          :settings="{
            data: htData,
            height: 'auto',
          }"
          licenseKey="non-commercial-and-evaluation"
          style="width: 100%; height: 800px"
        ></hot-table>
      </div>
      <div v-if="selectedGrid === 'revogrid'">
        <revo-grid
          theme="darkCompact"
          :source="rowData"
          :columns="columns"
          style="width: 100%; height: 800px"
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
import 'handsontable/dist/handsontable.full.css';
import { AgGridVue } from "ag-grid-vue3";
import RevoGrid from "@revolist/vue3-datagrid";
import ColumnGeneratorWorker from './columnGenerator.worker.ts?worker'


const selectedGrid = ref("ag-grid");
const renderTime = ref<number | null>(null);
const scrollFPS = ref<number | null>(null);
const memoryUsage = ref<{ usedJSHeapSize: number } | null>(null);

const rowData = ref<any[]>([]);
const htData = ref<any[][]>([]);
const columnDefs = ref([
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
  { field: "age", headerName: "Age" },
  { field: "city", headerName: "City" },
]);
const columns = ref([
  { prop: "id", name: "ID" },
  { prop: "name", name: "Name" },
  { prop: "age", name: "Age" },
  { prop: "city", name: "City" },
]);

let hotInstance: Handsontable | null = null;

onMounted(async () => {
  await fetchData(100);
  watch(selectedGrid, (newGrid) => {
    const start = performance.now();

    if (newGrid === 'handsontable') {
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
    const response = await fetch(`http://localhost:3000/api/users?rows=${rows}`);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();

    rowData.value = await new Promise((resolve, reject) => {
            // Initialize the worker
            const worker = new ColumnGeneratorWorker()

            worker.onmessage = (event) => {
                resolve(event.data)
                worker.terminate() // Cleanup
            }

            worker.onerror = (error) => {
                console.error('Worker error:', error)
                reject(error)
            }

            // Send data to the worker
            worker.postMessage({ rows: data, colsNumber: 1000 })
    })
    const newColumnsDefs = []
    const newColumns = []
    for (let j = 0; j < colsNumber; j++) {
      newColumns.push({
            name: generateHeader(j),
            prop: j,
      })
      newColumnsDefs.push({
            field: j,
            headerName: generateHeader(j),
      })
    }
    columns.value.push(...newColumns)
    // Transform data into Handsontable's array format
    htData.value = rowData.value.map((row: any) =>
      Object.values(row).map((value: any) => value)
    );
  } catch (error) {
    console.error("Error fetching data for Handsontable:", error);
  }
};

function generateHeader(index: number) {
    const asciiFirstLetter = 65
    const lettersCount = 26
    let div = index + 1
    let label = ''
    let pos
    while (div > 0) {
        pos = (div - 1) % lettersCount
        label = String.fromCharCode(asciiFirstLetter + pos) + label
        div = parseInt(((div - pos) / lettersCount).toString(), 10)
    }
    return label
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

watch(selectedGrid, () => {
  setTimeout(() => {
    document.querySelector("revo-grid revogr-viewport-scroll.rgCol .vertical-inner")?.addEventListener("scroll", onScroll);
    console.log(document.querySelector(".ag-body-viewport"));
    document
      .querySelector(".ag-body-viewport")
      ?.addEventListener("scroll", onScroll);
    document
      .querySelector(".ht_master.handsontable > .wtHolder")
      ?.addEventListener("scroll", onScroll);
  }, 1000)
}, { immediate: true });

// Memory measurement
setInterval(() => {
  if (performance.memory) {
    memoryUsage.value = {
      usedJSHeapSize: performance.memory.usedJSHeapSize / 1024 / 1024,
    };
  }
}, 5000);
</script>
