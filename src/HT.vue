<template>
  <div class="page" v-if="settings?.data.length > 0">
    <HotTable
      :settings="settings"
      licenseKey="non-commercial-and-evaluation"
      style="width: 100%; height: 600px"
    ></HotTable>
  </div>
</template>

<script setup lang="ts">
import { HotTable } from "@handsontable/vue3";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.css";
import { fetchData } from "./api";
import { onMounted, ref } from "vue";
registerAllModules();
const settings = ref<any | null>(null);

const { colsNumber, rowsNumber } = defineProps<{
  colsNumber: number;
  rowsNumber: number;
}>();
const emits = defineEmits(["fps"]);
onMounted(async () => {
  const rowData = await fetchData(rowsNumber, colsNumber, true); // Transform data into Handsontable's array format

  settings.value = {
    data: rowData,
    colWidths: "100px",
    height: "600px",
  };
  setTimeout(() => {
    document
      .querySelector(".ht_master.handsontable > .wtHolder")
      ?.addEventListener("scroll", () => emits("fps"));
  }, 1000);
});
</script>
