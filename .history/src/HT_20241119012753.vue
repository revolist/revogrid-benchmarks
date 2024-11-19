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
import { fetchData } from "./api";
import { onMounted, ref } from "vue";
registerAllModules();
const htData = ref<any[][]>([]);

const emits = defineEmits(["scroll"]);
onMounted(async () => {
  const rowData = await fetchData(1000, 100); // Transform data into Handsontable's array format
  htData.value = rowData.map((row: any) =>
    Object.values(row).map((value: any) => value)
  );
  setTimeout(() => {
    document
      .querySelector(".ht_master.handsontable > .wtHolder")
      ?.addEventListener("scroll", () => emits("scroll"));
  }, 1000);
});
</script>
