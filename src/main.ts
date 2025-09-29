import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import "@/styles/global.less";
import { setEditableByClass } from "./hooks/useDom";
import { createPinia } from "pinia";

const pinia = createPinia();

const app = createApp(App);

app.mixin({
  mounted() {
    setEditableByClass("ce");
  },
});

app.use(pinia);
app.use(router);
app.use(Antd);
app.mount("#app");
