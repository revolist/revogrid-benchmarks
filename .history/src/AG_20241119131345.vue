<template>
  <ag-grid-vue
    :rowData="rowData"
    :rowHeight="23"
    :columnDefs="columnDefs"
    style="width: 100%; height: 800px"
  ></ag-grid-vue>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "ag-grid-community/styles/ag-grid.css";
import { AgGridVue } from "ag-grid-vue3";
import { fetchData, generateHeader } from "./api";
const emits = defineEmits(["scroll"]);
const columnDefs = ref<any[]>([]);
const rowData = ref<any[]>([]);
onMounted(async () => {
  const colsNumber = 100;
  console.log(rowData.value);
  rowData.value = await fetchData(100, colsNumber);
  const newColumnsDefs = [];
  for (let j = 0; j < colsNumber; j++) {
    newColumnsDefs.push({
      field: j.toString(), // problem with non string prop
      headerName: generateHeader(j),
      minWidth: 100,
      maxWidth: 100,
    });
  }
  columnDefs.value = newColumnsDefs;
  setTimeout(() => {
    document
      .querySelector(".ag-body-viewport")
      ?.addEventListener("scroll", () => emits("scroll"));
  }, 1000);
});
</script>
