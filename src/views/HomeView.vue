<template>
  <div class="home-container">
    <header>
      <h1 class="app-title">Sport Connecting people</h1>
      <div class="user-section">
        <input type="text" placeholder="Search for event" class="search-input" />
        <div v-if="isLoggedIn">
          <button @click="toggleProfileMenu" class="profile-btn">Profile</button>
          <div v-if="showProfileMenu" class="profile-dropdown">
            <button @click="goToProfile">My Profile</button>
            <button @click="logout">Logout</button>
          </div>
        </div>
        <router-link v-else to="/login" class="login-btn">Login</router-link>
      </div>
    </header>
    <main>
      <EventsList />
    </main>
  </div>
</template>

<script>
import {computed, ref} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import EventsList from '../components/EventList.vue';

export default {
  components: {
    EventsList
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => store.state.user !== null);
    const showProfileMenu = ref(false);

    const logout = async () => {
      try {
        await store.dispatch('logout');
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
    };

    const toggleProfileMenu = () => {
      showProfileMenu.value = !showProfileMenu.value;
    };

    const goToLogin = () => {
      router.push('/login');
    };

    const goToProfile = () => {
      router.push('/profile');
    };

    return {
      isLoggedIn,
      logout,
      goToLogin,
      goToProfile,
      toggleProfileMenu,
      showProfileMenu
    };
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
}

.home-container {
  width: 100%;
  font-family: 'Arial', sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

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

.user-section img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 1rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin-right: 10px;
  outline: none;
  transition: border 0.3s;
}

.search-input:focus {
  border-color: #007bff;
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
</style>
