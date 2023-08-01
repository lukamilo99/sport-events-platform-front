<template>
  <div class="not-found-container">
    <h1>404</h1>
    <p>Sorry, the page you are looking for cannot be found.</p>
    <router-link to="/home">Go back to homepage</router-link>
  </div>
</template>

<script setup>

</script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
}

p {
  font-size: 1.5rem;
}
</style>
