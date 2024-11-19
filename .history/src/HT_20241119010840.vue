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
const htData = ref<any[][]>([]);


let hotInstance: Handsontable | null = null;
</script>