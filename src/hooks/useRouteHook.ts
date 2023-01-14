import { useRouter } from "vue-router";
import { computed } from "vue";
export default function useRouteHook() {
  const router = useRouter();
  const currentRouter = computed(() => router.currentRoute.value.name);
  const routerJump = (name: string) => {
    router.push({ name } as any);
  };
  return {
    currentRouter,
    routerJump,
  };
}
