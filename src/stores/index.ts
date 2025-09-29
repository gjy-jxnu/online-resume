import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import type { graph } from "../components/RightSidebar.vue";

export const useStore = defineStore("store", () => {
  const currentDragComponent = ref<graph | null>(null);

  return { currentDragComponent };
});
