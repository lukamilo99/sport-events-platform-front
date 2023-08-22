<template>
  <div class="d-flex flex-column min-vh-100">
    <HeaderComponent/>
    <div class="main-content flex-fill">
      <router-view/>
    </div>
    <FooterComponent/>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: 'App',
  components: {
    FooterComponent,
    HeaderComponent
  },
  setup() {
    const store = useStore();

    const initializeUserLocation = async () => {
      await store.dispatch('getUserLocation');
    }

    const authenticateUser = async () => {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        await store.dispatch('fetchUserAndRedirect');
      }
    }

    onMounted(async () => {
      await initializeUserLocation();
      await authenticateUser();
    });

    return {};
  }
}
</script>

<style>
body {
  background-color: #1098f7ff;
}

.main-content {
  margin-top: 40px;
  margin-bottom: 40px;
}
</style>
