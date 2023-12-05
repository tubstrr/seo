<template>
  <div>
    <h1>Nuxt module playground!</h1>
    <h2>Current Path: {{ route.path }}</h2>
    <ul class="links">
      <li>
        <NuxtLink to="/">
          Home
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about">
          About
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/about/our-history">
          Our History
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup>
const route = useRoute();
const { data } = await useFetch("/api/seo", {
  query: { path: route?.path },
});
useSeo(data.value);
</script>

<style>
.links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
