import Faq from "./pages/FAQ.svelte";
// import Home from "./pages/Home.svelte";
import Imprint from "./pages/Imprint.svelte";
import Info from "./pages/Info.svelte";
import Preferences from "./pages/Preferences.svelte";
import Privacy from "./pages/Privacy.svelte";

export const routes = {
  // "/": Home, // Home view is always active to not interrupt file convertion
  "/preferences": Preferences,
  "/info": Info,
  "/imprint": Imprint,
  "/privacy": Privacy,
  "/faq": Faq,
};
