import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "@/services/auth.store";

import Home from "@/views/Pages/Home.vue";
import Login from "@/views/Pages/Login.vue";
import Register from "@/views/Pages/Register.vue";
import Profile from "@/views/Pages/Profile.vue";
import Search from "@/views/Pages/Search.vue";
import ItemDetail from "@/views/Pages/ItemDetail.vue";
import CreateItem from "@/views/Pages/CreateItem.vue";
import NotFound from "@/views/Pages/NotFound.vue";
import Drafts from "@/views/Pages/Drafts.vue";

const ifAuthenticated = (to, from, next) => {
  const token = authStore.getToken();
  if (token) return next();
  return next("/login");
};

const routes = [
  { path: "/", component: Home },
  { path: "/search", component: Search },
  { path: "/item/create", component: CreateItem, beforeEnter: ifAuthenticated },
  { path: "/item/:item_id", component: ItemDetail },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  {
    path: "/profile/:user_id",
    component: Profile,
    beforeEnter: ifAuthenticated,
  },
  { path: "/drafts", component: Drafts, beforeEnter: ifAuthenticated },
  { path: "/:pathMatch(.*)*", component: NotFound },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
