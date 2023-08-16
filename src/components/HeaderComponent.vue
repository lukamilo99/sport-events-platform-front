<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark top">
    <router-link to="/home" class="navbar-brand">Sport Connecting People</router-link>
    <div class="navbar-nav">
      <router-link to="/home" class="nav-item nav-link">Home</router-link>
      <router-link :to="{ path: '/events', query: { page: '1' } }" class="nav-item nav-link">Events</router-link>
      <router-link v-if="isAdmin" to="/users" class="nav-item nav-link btn btn-success">Users</router-link>
    </div>
    <div class="ms-auto">
      <div v-if="isLoggedIn" class="dropdown profile-dropdown">
        <button class="btn btn-primary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          Profile
        </button>
        <div class="dropdown-menu" aria-labelledby="profileDropdown">
          <button @click="goToProfile" class="dropdown-item">My Profile</button>
          <button @click="logout" class="dropdown-item">Logout</button>
        </div>
      </div>
      <router-link v-else to="/login" class="ml-3 btn btn-success">Login</router-link>
    </div>
  </nav>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoggedIn = computed(() => store.getters.user !== null);
    const isAdmin = computed(() => {
      return isLoggedIn.value && store.getters.user.role === 'ADMIN';
    });
    const showProfileMenu = ref(false);

    const logout = async () => {
      try {
        await store.dispatch('logout');
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
    };

    const goToProfile = () => {
      router.push('/profile/my-profile');
    };

    return {
      isLoggedIn,
      logout,
      showProfileMenu,
      goToProfile,
      isAdmin
    };
  },
};
</script>

<style scoped>
.navbar {
  background-color: #000000ff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
}

.nav-item.nav-link:hover {
  color: #ddd;
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu {
  border: 1px solid #ddd;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.profile-dropdown {
  position: relative;
  margin-right: 20px;
}

.nav-item {
  margin-left: 15px;
}
</style>

