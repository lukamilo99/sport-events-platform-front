<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark top">
    <router-link to="/home" class="navbar-brand">Sport Connecting People</router-link>
    <div class="navbar-nav">
      <router-link to="/home" class="nav-item nav-link">Home</router-link>
      <router-link :to="{ path: '/events', query: { page: '1' } }" class="nav-item nav-link">Events</router-link>
      <router-link :to="{ path: '/connect', query: { page: '1' } }" class="nav-item nav-link">Connect</router-link>
      <router-link v-if="isAdmin" to="/users" class="nav-item nav-link btn btn-success">Users</router-link>
    </div>
    <div class="ms-auto">
      <div v-if="isLoggedIn" class="dropdown profile-dropdown">
        <button class="btn btn-primary" type="button" id="notificationsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-bell"></i>
          <span v-if="unreadNotificationsCount" class="badge bg-danger">{{ unreadNotificationsCount }}</span>
        </button>
        <div class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown">
          <div v-for="notification in notifications.slice(0, 3)" :key="notification.id" class="dropdown-item">
            {{ notification.message }}

            <div v-if="notification.type === 'REQUEST'">
              <button @click="acceptRequest(notification)">Approve</button>
              <button @click="declineRequest(notification)">Reject</button>
            </div>
          </div>
          <router-link to="/profile/notification" class="dropdown-item">See more</router-link>
          <div v-if="!notifications.length" class="dropdown-item">
            No notifications.
          </div>
        </div>

        <button class="btn btn-primary dropdown-toggle" type="button" id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">
          Profile
        </button>
        <div class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
          <button @click="goToProfile" class="dropdown-item">My Profile</button>
          <button @click="logout" class="dropdown-item">Logout</button>
        </div>
      </div>
      <router-link v-else to="/login" class="ml-3 btn btn-success">Login</router-link>
    </div>
  </nav>
</template>

<script>
import {computed, ref, watch} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const isLoggedIn = computed(() => store.getters.user !== null);
    const isAdmin = computed(() => {
      return isLoggedIn.value && store.getters.user.role === 'ADMIN';
    });
    const showProfileMenu = ref(false);
    const notifications = ref([]);
    const unreadNotificationsCount = ref(0);

    watch(isLoggedIn, (loggedIn) => {
      if (loggedIn) {
        fetchNotifications();
      }
    });

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/notification`, {
          params: {
            page: 0,
            size: 3
          }
        });
        notifications.value = response.data.notifications;
        unreadNotificationsCount.value = response.data.unreadCount;
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const acceptRequest = async (notification) => {
      try {
        await axios.post(`http://localhost:8081/interaction/request/${notification.requestId}/accept`);
        await fetchNotifications();
      } catch (error) {
        console.error("Error accepting request:", error);
      }
    };

    const declineRequest = async (notification) => {
      try {
        await axios.post(`http://localhost:8081/interaction/request/${notification.requestId}/decline`);
        await fetchNotifications();
      } catch (error) {
        console.error("Error declining request:", error);
      }
    };

    const logout = async () => {
      try {
        await store.dispatch('logout');
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
    };

    const goToProfile = () => {
      router.push('/profile/info');
    };

    return {
      isLoggedIn,
      logout,
      showProfileMenu,
      goToProfile,
      isAdmin,
      acceptRequest,
      declineRequest,
      notifications,
      unreadNotificationsCount
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

