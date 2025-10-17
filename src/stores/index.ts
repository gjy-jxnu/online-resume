import { defineStore } from "pinia";
import { ref, reactive, computed } from "vue";
import type { MyComponent } from "../components/RightSidebar.vue";

export const useStore = defineStore("store", () => {
  const currentDragComponent = ref<MyComponent | null>(null);
  const pageSchema = ref<MyComponent | null>(null);
  const currentCheckedID = ref("");

  return {
    currentDragComponent,
    pageSchema,
    currentCheckedID,
  };
});
