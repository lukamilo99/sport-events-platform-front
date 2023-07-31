<template>
  <div class="update-event-container">
    <EventForm
        :mode="'update'"
        @submit="updateEvent"
    />
  </div>
</template>

<script>
import EventForm from "@/components/EventForm.vue";
import axios from "axios";
import { useStore } from 'vuex';
import {computed} from "vue";

export default {
  components: {
    EventForm
  },
  setup() {
    const store = useStore()
    const eventToEdit = computed(() => store.getters['event']);

    const updateEvent = async (updatedEventData) => {
      try {
        await axios.put(`http://localhost:8081/event/update`, updatedEventData);
        await store.dispatch('addNotification', {
          type: 'success',
          message: 'Event successfully updated!'
        });
        await store.dispatch('deselectEvent');
      } catch (error) {
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Error updating event!'
        });
      }
    }

    return {
      eventToEdit,
      updateEvent
    }
  }
};
</script>
