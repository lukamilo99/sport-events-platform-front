<template>
  <div v-if="notification" :class="notificationClass">
    {{ notification.message }}
  </div>
</template>

<script>
import { computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const notification = computed(() => store.getters['notifications'][0]);

    const notificationClass = computed(() => {
      return `notification ${notification.value ? notification.value.type : ''}`;
    });

    const autoRemoveNotification = () => {
      if (notification.value) {
        setTimeout(() => {
          store.dispatch('removeNotification', notification.value);
        }, 3000);
      }
    };

    watch(notification, () => {
      autoRemoveNotification();
    }, { immediate: true });

    return {
      notification,
      notificationClass
    };
  }
};
</script>

<style scoped>
.notification.error, .notification.success, .notification.info {
  display: inline-block;
  padding: 10px 15px;
  border-radius: 5px;
  max-width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification.error {
  background-color: rgba(255, 204, 204, 0.9);
  color: #f44336;
  border: 1px solid #f44336;
}

.notification.success {
  background-color: rgba(204, 255, 204, 0.9);
  color: #4caf50;
  border: 1px solid #4caf50;
}

.notification.info {
  background-color: rgba(204, 204, 255, 0.9);
  color: #2196f3;
  border: 1px solid #2196f3;
}
</style>
