<template>
  <ag-grid-vue
    :rowData="rowData"
    :columnDefs="columnDefs"
    style="width: 100%; height: 800px"
  ></ag-grid-vue>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { fetchData, generateHeader } from "./api";
const columnDefs = ref([
  { field: "name", headerName: "Name", minWidth: 100, maxWidth: 100 },
  { field: "age", headerName: "Age", minWidth: 100, maxWidth: 100 },
  { field: "city", headerName: "City", minWidth: 100, maxWidth: 100 },
]);
const rowData = ref<any[]>([]);
onMounted(async () => {
  const rowData = await fetchData(100000);
  const newColumnsDefs = [];
  for (let j = 0; j < colsNumber; j++) {
    newColumnsDefs.push({
      field: j.toString(), // problem with non string prop
      headerName: generateHeader(j),
      minWidth: 100,
      maxWidth: 100,
    });
  }
  columnDefs.value.push(...newColumnsDefs);
  setTimeout(() => {
    document
      .querySelector(".ag-body-viewport")
      ?.addEventListener("scroll", onScroll);
  }, 1000);
});
</script>
