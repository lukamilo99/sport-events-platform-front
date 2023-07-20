<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
import { useStore } from 'vuex';

export default {
  name: 'App',
  async created() {
    const store = useStore();
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      await store.dispatch('fetchUserAndRedirect');
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
