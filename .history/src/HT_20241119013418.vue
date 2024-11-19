<template>
  <HotTable
    :settings="settings"
    licenseKey="non-commercial-and-evaluation"
    style="width: 100%; height: 800px"
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

const emits = defineEmits(["scroll"]);
onMounted(async () => {
  const rowData = await fetchData(100, 100); // Transform data into Handsontable's array format
  settings.value = {
    data: rowData.map((row: any) =>
      Object.values(row).map((value: any) => value)
    ),
    height: "auto",
  };
  setTimeout(() => {
    document
      .querySelector(".ht_master.handsontable > .wtHolder")
      ?.addEventListener("scroll", () => emits("scroll"));
  }, 1000);
});
</script>
