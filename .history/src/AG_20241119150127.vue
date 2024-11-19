<template>
  <ag-grid-vue
    v-if="rowData.length > 0"
    :rowData="rowData"
    :rowHeight="23"
    :columnDefs="columnDefs"
    style="width: 100%; height: 600px"
  ></ag-grid-vue>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "ag-grid-community/styles/ag-grid.css";
import { AgGridVue } from "ag-grid-vue3";
import { fetchData, generateHeader } from "./api";
const { colsNumber, rowsNumber } = defineProps<{ colsNumber: number; rowsNumber: number }>();
const emits = defineEmits(["fps"]);
const columnDefs = ref<any[]>([]);
const rowData = ref<any[]>([]);
onMounted(async () => {
  rowData.value = await fetchData(rowsNumber, colsNumber);
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
      ?.addEventListener("scroll", () => emits("fps"));
  }, 1000);
});
</script>
