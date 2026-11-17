import {createApp} from "vue";
// Only the Bootstrap components that are driven by `data-bs-*` attributes need loading here
// (the navbar drawer).
import "bootstrap/js/dist/drawer.js";
import "@/assets/styles/styles.scss";
import "@/icons";
import App from "@/App.vue";
import router from "@/router";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);

app.mount("#app");
