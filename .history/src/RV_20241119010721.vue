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

import RevoGrid from "@revolist/vue3-datagrid";
</script>