<template>
  <div class="home-container">
    <header>
      <h1 class="app-title">Sport Connecting people</h1>
      <div class="user-section">
        <button v-if="isLoggedIn" @click="goToProfile" class="profile-btn">Profile</button>
        <button v-if="isLoggedIn" @click="logout" class="logout-btn">Logout</button>
        <router-link v-else to="/login" class="login-btn">Login</router-link>
      </div>
    </header>
    <main>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const isLoggedIn = computed(() => store.state.user !== null);

    const logout = async () => {
      try {
        await store.dispatch('logout');
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
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
      goToProfile
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

.logout-btn {
  background-color: #dc3545;
  color: #fff;
}

.logout-btn:hover {
  background-color: #b22234;
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
</style>
