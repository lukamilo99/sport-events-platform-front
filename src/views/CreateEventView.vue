<template>
  <div class="create-event-container">
    <EventForm
        :mode="'create'"
        @submit="createEvent"
    />
  </div>
</template>

<script>
import EventForm from "@/components/EventForm.vue";
import axios from "axios";
import {store} from "@/store/store";

export default {
  components: {
    EventForm
  },
  setup() {
    const createEvent = async (eventData) => {
      try {
        await axios.post('http://localhost:8081/event/create', eventData);
        await store.dispatch('addNotification', {
          type: 'success',
          message: 'Event successfully created!'
        });
      } catch (error) {
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Error creating event!'
        });
      }
    }

    return {
      createEvent
    }
  }
};
</script>
