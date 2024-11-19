import { createRouter, createWebHistory } from 'vue-router';

// Import your views
import AG from './AG.vue';
import HT from './HT.vue';
import RV from './RV.vue';

const routes = [
  { path: '/', name: 'Home', component: AG },
  { path: '/about', name: 'About', component: HT },
  { path: '/contact', name: 'Contact', component: RV },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;