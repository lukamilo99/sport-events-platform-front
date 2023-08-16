<template>
  <div>
    <HeaderComponent/>
    <div class="main-content">
      <router-view/>
    </div>
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
body {
  background-color: #1098f7ff;
}

.main-content {
  margin-top: 40px;
}
</style>
