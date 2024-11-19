import { createRouter, createWebHistory } from 'vue-router';

// Import your views
import AG from './AG.vue';
import HT from './HT.vue';
import RV from './RV.vue';

const routes = [
  { path: '/ag', name: 'AG-Grid', component: AG },
  { path: '/ht', name: 'Handsontable', component: HT },
  { path: '/rv', name: 'RevoGrid', component: RV },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;