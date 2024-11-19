import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/ag', name: 'AG-Grid', component: () => import('./AG.vue') },
  { path: '/ht', name: 'Handsontable', component: () => import('./HT.vue') },
  { path: '/rv', name: 'RevoGrid', component: () => import('./RV.vue') },
  { path: '/rt', name: 'ReactTable', component: () => import('./RT.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;