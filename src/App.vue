<template>
  <div>
    <HeaderComponent/>
    <router-view/>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import HeaderComponent from "@/components/HeaderComponent.vue";

export default {
  name: 'App',
  components: {
    HeaderComponent
  },
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
body, html {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

button {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 25px;
  background-color: #007BFF;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

h1, h2 {
  text-align: center;
  margin-bottom: 20px;
}
</style>
