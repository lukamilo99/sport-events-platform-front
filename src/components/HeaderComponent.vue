<template>
  <header>
    <div class="left-section">
      <router-link to="/home" class="app-title-link">
        <h1 class="app-title">Sport Connecting People</h1>
      </router-link>
      <router-link to="/home" class="nav-link">Home</router-link>
      <router-link :to="{ path: '/events', query: { page: '1' } }" class="nav-link">Events</router-link>
    </div>
    <div class="user-section">
      <div v-if="isLoggedIn">
        <button @click="toggleProfileMenu" class="profile-btn" tabindex="0" @blur="hideDropdown">Profile</button>
        <div v-if="showProfileMenu" class="profile-dropdown">
          <button @click="goToProfile">My Profile</button>
          <button @click="logout">Logout</button>
        </div>
      </div>
      <router-link v-else to="/login" class="login-btn">Login</router-link>
    </div>
  </header>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoggedIn = computed(() => store.state.user.user !== null);
    const showProfileMenu = ref(false);

    const logout = async () => {
      try {
        await store.dispatch('logout');
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
    };

    const hideDropdown = () => {
      setTimeout(() => {
        showProfileMenu.value = false;
      }, 100);
    };

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
    };

    const goToProfile = () => {
      router.push('/profile/my-profile');
    };

    return {
      isLoggedIn,
      logout,
      toggleProfileMenu,
      showProfileMenu,
      goToProfile,
      hideDropdown
    };
  },
};
</script>

<style scoped>
header {
  background-color: #343a40;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

button, .login-btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover, .login-btn:hover {
  transform: scale(1.05);
}

.profile-btn {
  background-color: #007bff;
  color: #fff;
}

.profile-btn:hover {
  background-color: #0056b3;
}

.login-btn {
  background-color: #28a745;
  color: #fff;
  text-decoration: none;
  display: inline-block;
  vertical-align: middle;
  padding: 0.5rem 1.5rem;
}

.login-btn:hover {
  background-color: #217c3b;
}

.profile-dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  top: 60px;
  right: 5%;
  width: 150px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  z-index: 1001;
}

.profile-dropdown button {
  width: 100%;
  text-align: left;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.app-title-link, .nav-link {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.app-title-link:hover, .nav-link:hover {
  color: #ddd;
}

.nav-link {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  background-color: transparent;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
