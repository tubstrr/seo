import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const options = nuxtApp.$config.app?.seo;
  if (!options?.auto) return;
  // Server side on initial render
  useSeo();
  nuxtApp.hook("page:finish", () => {
    useSeo();
  });
});
