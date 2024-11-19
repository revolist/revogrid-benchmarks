<template>
 <ag-grid-vue
          :rowData="rowData"
          :columnDefs="columnDefs"
          style="width: 100%; height: 800px"
        ></ag-grid-vue>
  </template>

<script setup lang="ts">

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";

</script>