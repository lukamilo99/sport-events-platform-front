<template>
  <div class="home-container">
    <header>
      <h1 class="app-title">Sport Connecting People</h1>
      <div class="user-section">
        <button @click="createEvent" class="create-event-btn">Create Event</button>
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
    <section class="search-section">
      <div class="search-wrapper">
        <div class="icon-filters">
          <button @click="redirectToEvents('sport', 'football')" class="icon-btn">⚽</button>
          <button @click="redirectToEvents('sport', 'basketball')" class="icon-btn">🏀</button>
          <button @click="redirectToEvents('sport', 'tennis')" class="icon-btn">🎾</button>
          <button @click="redirectToEvents('city', 'belgrade')" class="icon-btn">🏙️</button>
          <button @click="redirectToEvents('city', 'novi_sad')" class="icon-btn">🌆</button>
          <button @click="redirectToEvents('city', 'nis')" class="icon-btn">🌄</button>
        </div>
        <input type="text" placeholder="Search by city or sport" class="search-input-extended" />
      </div>
    </section>
    <h2 class="latest-events-title">Latest Events</h2>
    <main>
      <EventsList :events="events" />
    </main>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import EventsList from '../components/EventList.vue';
import axios from "axios";

export default {
  components: {
    EventsList
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoggedIn = computed(() => store.state.user !== null);
    const showProfileMenu = ref(false);
    const events = ref([]);

    onMounted(async () => {
      try {
        const response = await axios.get('http://localhost:8081/event/latest');
        events.value = response.data;
      } catch (error) {
        console.error("Error fetching recent events:", error);
      }
    });

    const redirectToEvents = (type, value) => {
      let query = {};
      query[type] = value;
      router.push({ path: '/events', query: query });
    };

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

    const createEvent = () => {
      router.push('/create-event');
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
      createEvent,
      showProfileMenu,
      events,
      redirectToEvents
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

.create-event-btn {
  background-color: #28a745;
  color: #fff;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.create-event-btn:hover {
  background-color: #217c3b;
  transform: scale(1.05);
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

.latest-events-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 15px;
  text-align: center;
  color: #343a40;
}

.search-section {
  background-color: #f8f9fa;
  padding: 20px 5%;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 80px;
}

.search-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icon-filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.icon-btn {
  background-color: #e0e0e0;
  border: none;
  padding: 10px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.icon-btn:hover {
  background-color: #d1d1d1;
}

.search-input-extended {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border 0.3s;
}

.search-input-extended:focus {
  border-color: #007bff;
}
</style>
