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

const globalLoader = document.getElementById("global-loader");

if (globalLoader) {
  globalLoader.style.transition = "opacity 0.3s ease";
  globalLoader.style.opacity = "0";
  globalLoader.style.pointerEvents = "none";

  setTimeout(() => {
    if (globalLoader.parentNode) {
      globalLoader.parentNode.removeChild(globalLoader);
    }
  }, 300);
}
