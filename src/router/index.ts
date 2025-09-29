import { createWebHistory, createRouter } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",
    component: import("@/views/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory("/online-resume/"),
  routes,
});

export default router;
