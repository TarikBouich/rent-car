import { createApp } from "vue";
import "./style.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);
app.directive("click-outside", {
  beforeMount: function (el, binding) {
    const ourClickEventHandler = (event) => {
      if (!el.contains(event.target) && el !== event.target) {
        binding.value(event);
      }
    };
    el.__vueClickEventHandler__ = ourClickEventHandler;
    document.addEventListener("click", ourClickEventHandler);
  },
  unmounted: function (el) {
    document.removeEventListener("click", el.__vueClickEventHandler__);
  },
});
app.use(router);
app.mount("#app");
