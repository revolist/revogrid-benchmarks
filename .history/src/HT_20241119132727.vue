<template>
  <HotTable
    v-if="settings"
    :settings="settings"
    licenseKey="non-commercial-and-evaluation"
    style="width: 100%; height: 600px"
  ></HotTable>
</template>

<script setup lang="ts">
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { fetchData } from "./api";
import { onMounted, ref } from "vue";
registerAllModules();
const settings = ref<any | null>(null);

const emits = defineEmits(["fps"]);
onMounted(async () => {
  const rowData = await fetchData(100, 100); // Transform data into Handsontable's array format
  
  settings.value = {
    data: rowData.map((row: any) =>
      Object.values(row).map((value: any) => value)
    ),
    colWidths: '100px',
    height: "600px",
  };
  setTimeout(() => {
    document
      .querySelector(".ht_master.handsontable > .wtHolder")
      ?.addEventListener("scroll", () => emits("fps"));
  }, 1000);
});
</script>
