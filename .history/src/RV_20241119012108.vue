<template>
  <revo-grid
    theme="darkCompact"
    :colSize="100"
    :source="rowData"
    :columns="columns"
    style="width: 100%; height: 800px"
  ></revo-grid>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RevoGrid from "@revolist/vue3-datagrid";
import { fetchData, generateHeader } from "./api";
const emits = defineEmits(["scroll"]);
const columns = ref([
  { prop: "name", name: "Name", size: 100 },
  { prop: "age", name: "Age", size: 100 },
  { prop: "city", name: "City", size: 100 },
]);
const rowData = ref<any[]>([]);
onMounted(async () => {
  const colsNumber = 100;
  rowData.value = await fetchData(100000, colsNumber);
  const newColumns: any[] = [];
  for (let j = 0; j < colsNumber; j++) {
    newColumns.push({
      name: generateHeader(j),
      prop: j,
    });
  }
  columns.value.push(...newColumns);
  setTimeout(() => {
    document
      .querySelector("revo-grid revogr-viewport-scroll.rgCol .vertical-inner")
      ?.addEventListener("scroll", () => emits("scroll"));
  }, 1000);
});
</script>
