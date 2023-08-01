<template>
  <div class="create-event-container">
    <EventForm
        v-if="eventToEdit"
        :mode="'edit'"
        :initial-event="eventToEdit"
        @submit="updateEvent"
    />
  </div>
</template>

<script>
import EventForm from "@/components/EventForm.vue";
import axios from "axios";
import { useStore } from 'vuex';
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

export default {
  components: {
    EventForm
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const eventId = router.currentRoute.value.params.eventId;
    const eventToEdit = ref(null);

    const updateEvent = async (updatedEventData) => {
      try {
        await axios.put(`http://localhost:8081/event/update/${eventId}`, updatedEventData);
        await store.dispatch('addNotification', {
          type: 'success',
          message: 'Event successfully updated!'
        });
      } catch (error) {
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Error updating event!'
        });
      }
    };

    const getEventToUpdate = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/event/for-update/${eventId}`);
        eventToEdit.value = response.data;
      } catch (error) {
        console.error('Error fetching event:', error);
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Error fetching event!'
        });
      }
    };

    onMounted(getEventToUpdate)

    return {
      eventToEdit,
      updateEvent
    };
  }
};
</script>
