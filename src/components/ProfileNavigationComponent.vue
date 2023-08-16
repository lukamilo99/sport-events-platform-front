<template>
  <nav class="navigation-switch nav">
    <button
        class="menu-item nav-item btn btn-light"
        :class="{ active: currentRoute === '/profile/my-profile' }"
        @click="goTo('/profile/my-profile')">My Profile</button>
    <button
        class="menu-item nav-item btn btn-light"
        :class="{ active: currentRoute === '/profile/my-events' }"
        @click="goTo('/profile/my-events')">My Events</button>
  </nav>
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
  gap: 10px;
}

.menu-item.active {
  background-color: #007BFF !important;
  color: white !important;
  font-weight: bold;
}
</style>

