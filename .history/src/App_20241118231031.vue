<template>
  <div>
    <h1>Performance Metrics Comparison</h1>
    <p>Select a grid to test:</p>
    <select v-model="selectedGrid">
      <option value="ag-grid">AG Grid</option>
      <option value="handsontable">Handsontable</option>
      <option value="tanstack">TanStack Table</option>
      <option value="revogrid">RevoGrid</option>
    </select>

    <div>
      <h2>Selected Grid: {{ selectedGrid }}</h2>
      <div v-if="selectedGrid === 'ag-grid'">
        <ag-grid-vue :rowData="rowData" :columnDefs="columnDefs" style="width: 100%; height: 400px;"></ag-grid-vue>
      </div>
      <div v-if="selectedGrid === 'handsontable'">
        <div ref="hotContainer" id="handsontable" style="width: 100%; height: 400px;"></div>
      </div>
      <div v-if="selectedGrid === 'tanstack'">
        <div id="tanstack" style="width: 100%; height: 400px; overflow: auto;">
          <table>
            <thead>
              <tr>
                <th v-for="column in columns" :key="column.accessor">{{ column.header }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rowData" :key="row.id">
                <td v-for="column in columns" :key="column.accessor">{{ row[column.accessor] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="selectedGrid === 'revogrid'">
        <revo-grid :source="rowData" :columns="columnDefs" style="width: 100%; height: 400px;"></revo-grid>
      </div>
    </div>

    <div>
      <h2>Performance Metrics</h2>
      <p>Render Time: {{ renderTime }} ms</p>
      <p>Scroll FPS: {{ scrollFPS }}</p>
      <p>Memory Usage: {{ memoryUsage ? `${memoryUsage.usedJSHeapSize.toFixed(2)} MB` : 'N/A' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Handsontable from 'handsontable';
import { createTable } from '@tanstack/vue-table';
import RevoGrid from '@revolist/vue3-datagrid';

const selectedGrid = ref('ag-grid');
const renderTime = ref<number | null>(null);
const scrollFPS = ref<number | null>(null);
const memoryUsage = ref<{ usedJSHeapSize: number } | null>(null);

const rowData = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Name ${i}`,
  age: Math.floor(Math.random() * 50) + 20,
  city: `City ${Math.floor(Math.random() * 10)}`,
}));

const columnDefs = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' },
  { field: 'age', headerName: 'Age' },
  { field: 'city', headerName: 'City' },
];

const columns = [
  { accessor: 'id', header: 'ID' },
  { accessor: 'name', header: 'Name' },
  { accessor: 'age', header: 'Age' },
  { accessor: 'city', header: 'City' },
];

let hotInstance: Handsontable | null = null;

onMounted(() => {
  watch(selectedGrid, (newGrid) => {
    const start = performance.now();

    // Handsontable
    if (newGrid === 'handsontable' && !hotInstance) {
      hotInstance = new Handsontable(document.getElementById('handsontable') as HTMLElement, {
        data: rowData,
        columns: columnDefs.map((col) => ({ data: col.field })),
        colHeaders: columnDefs.map((col) => col.headerName),
        rowHeaders: true,
        width: '100%',
        height: '400px',
      });
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
  document.querySelector('#tanstack')?.addEventListener('scroll', onScroll);
  document.querySelector('#revogrid')?.addEventListener('scroll', onScroll);
  document.querySelector('.ag-root-wrapper')?.addEventListener('scroll', onScroll);
});

// Memory measurement
setInterval(() => {
  if (performance.memory) {
    memoryUsage.value = { usedJSHeapSize: performance.memory.usedJSHeapSize / 1024 / 1024 };
  }
}, 5000);
</script>