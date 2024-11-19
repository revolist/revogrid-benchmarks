<template>

<div class="page" v-if="rowData.length > 0">
  <revo-grid
    v-if="rowData.length > 0"
    :theme="isDarkMode ? 'darkCompact' : 'compact'"
    :rowSize="23"
    :colSize="100"
    :source="rowData"
    :columns="columns"
    style="width: 100%; height: 600px"
  ></revo-grid>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RevoGrid from "@revolist/vue3-datagrid";
import { fetchData, generateHeader } from "./api";
const { colsNumber, rowsNumber } = defineProps<{ colsNumber: number; rowsNumber: number }>();
const emits = defineEmits(["fps"]);
const columns = ref<any[]>([]);
const rowData = ref<any[]>([]);
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
onMounted(async () => {
  rowData.value = await fetchData(rowsNumber, colsNumber);
  const newColumns: any[] = [];
  for (let j = 0; j < colsNumber; j++) {
    newColumns.push({
      name: generateHeader(j),
      prop: j,
    });
  }
  columns.value = newColumns;
  setTimeout(() => {
    document
      .querySelector("revo-grid revogr-viewport-scroll.rgCol .vertical-inner")
      ?.addEventListener("scroll", () => emits("fps"));
  }, 1000);
});
</script>
