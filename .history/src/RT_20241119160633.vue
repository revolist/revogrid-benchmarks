<template>
    <div v-if="rowData.length > 0" ref="reactContainer"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, Component, nextTick } from "vue";
  import { ReactConnector } from "./ReactTableWrapper";
  import { fetchData, generateHeader } from "./api";

  const reactContainer = ref<Component | null>(null);
  
  const { colsNumber, rowsNumber } = defineProps<{
    colsNumber: number;
    rowsNumber: number;
  }>();
  
  const rowData = ref<any[]>([]);
  const columns = ref<any[]>([]);
  
  onMounted(async () => {
    // Fetch data
    const data = await fetchData(rowsNumber, colsNumber);
  
    // Generate columns
    const columnDefs = [];
    for (let j = 0; j < colsNumber; j++) {
      columnDefs.push({
        accessorKey: j.toString(),
        header: generateHeader(j),
      });
    }
  
    rowData.value = data;
    columns.value = columnDefs;
    await nextTick();
    const reactComponent = new ReactConnector(reactContainer.value)
    reactComponent.render()
  });
  </script>