import { computed, ref } from "vue";
import { ElScrollbar } from "element-plus";
import { useRoute } from "vue-router";

export default function matchListToTopHook(routeName = "MatchList") {
  const currentTop = ref(0);

  const route = useRoute();

  const hasToTop = computed(() => {
    return currentTop.value > 100 && routeName === route.name;
  });

  function scrollHandle({ scrollTop }: { scrollTop: number }) {
    currentTop.value = scrollTop;
  }

  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();

  function toTopHandle() {
    if (scrollbarRef.value) {
      scrollbarRef.value?.setScrollTop(0);
    }
  }

  return { hasToTop, scrollHandle, toTopHandle, scrollbarRef };
}
