<template>
  <hot-table
    :settings="{
      data: htData,
      height: 'auto',
    }"
    licenseKey="non-commercial-and-evaluation"
    style="width: 100%; height: 800px"
  ></hot-table>
</template>

<script setup lang="ts">
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { fetchData} from './api';
registerAllModules();
const htData = ref<any[][]>([]);

let hotInstance: Handsontable | null = null;
onMounted(async () => {
  const rowData = await fetchData(100000);    // Transform data into Handsontable's array format
    htData.value = rowData.value.map((row: any) =>
      Object.values(row).map((value: any) => value)
    );
  setTimeout(() => {
    document
      .querySelector(".ht_master.handsontable > .wtHolder")
      ?.addEventListener("scroll", onScroll);
  }, 1000);
});
</script>
