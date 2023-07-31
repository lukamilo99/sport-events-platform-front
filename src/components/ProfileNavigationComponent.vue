<template>
  <div class="navigation-switch">
    <button
        class="menu-item"
        :class="{ active: currentRoute === '/profile/my-profile' }"
        @click="goTo('/profile/my-profile')">My Profile</button>
    <button
        class="menu-item"
        :class="{ active: currentRoute === '/profile/my-events' }"
        @click="goTo('/profile/my-events')">My Events</button>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const currentRoute = ref(router.currentRoute.value.path);

    watch(
        () => router.currentRoute,
        (newRoute) => {
          currentRoute.value = newRoute.path;
        }
    );

    const goTo = (routePath) => {
      router.push(routePath);
    };

    return {
      goTo,
      currentRoute
    };
  }
};
</script>

<style scoped>
.navigation-switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menu-item {
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 1rem;
  padding: 8px;
  transition: background-color 0.3s;
}

.menu-item:hover, .menu-item.active {
  background-color: #f1f1f1;
  border-radius: 5px;
}

.menu-item.active {
  color: #007BFF;
  font-weight: bold;
}
</style>
