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
import { ref, onMounted, watch } from "vue";
import RevoGrid from "@revolist/vue3-datagrid";
const columns = ref([
  { prop: "name", name: "Name", size: 100 },
  { prop: "age", name: "Age", size: 100 },
  { prop: "city", name: "City", size: 100 },
]);
const rowData = ref<any[]>([]);onMounted(async () => {
    setTimeout(() => {
      document
        .querySelector("revo-grid revogr-viewport-scroll.rgCol .vertical-inner")
        ?.addEventListener("scroll", onScroll);
    }, 1000);
})
</script>