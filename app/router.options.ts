import type { RouterConfig } from "@nuxt/schema";

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // hero 过渡进行中时禁用默认滚动恢复
    const busy = useState("hero-transition-phase", () => "idle").value !== "idle";
    if (busy) return false;
    return savedPosition || { top: 0 };
  },
};