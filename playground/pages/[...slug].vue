<template>
  <div>
    <h1>Nuxt module playground!</h1>
    <h2>Current Path: {{ route.path }}</h2>
    <ul class="links">
      <li>
        <NuxtLink to="/"> Home </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about"> About </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about/our-history"> Our History </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const route = useRoute();
const { data } = await useFetch("/api/seo", {
  query: { path: route?.path },
});
await useSeo(data.value);

const faq = {
  schemas: [
    {
      hid: "testing",
      schema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Item Title",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vestibulum nulla ut nibh vulputate egestas. ",
            },
          },
          {
            "@type": "Question",
            name: "Hello world!",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vestibulum nulla ut nibh vulputate egestas. ",
            },
          },
          {
            "@type": "Question",
            name: "Item Title",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras vestibulum nulla ut nibh vulputate egestas. ",
            },
          },
        ],
      },
    },
  ],
};
addSeo(faq);
</script>

<style>
.links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
