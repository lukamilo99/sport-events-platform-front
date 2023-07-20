<template>
  <div class="create-event-container">
    <h2>Create New Event</h2>

    <form @submit.prevent="submitForm">
      <input type="text" v-model="event.name" placeholder="Event Name" required />

      <input type="number" v-model="event.capacity" placeholder="Capacity" required />

      <input type="text" v-model="event.sport" placeholder="Sport" required />

      <Vue3Datepicker v-model="event.date" :formatter="customFormatter"></Vue3Datepicker>

      <input type="text" ref="autocompleteInput" placeholder="Location" required />

      <button type="submit" class="create-event-btn">Submit</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import Vue3Datepicker from 'vue3-datepicker';

export default {
  components: {
    Vue3Datepicker
  },
  setup() {
    const event = ref({
      name: '',
      capacity: null,
      sport: '',
      location: '',
      date: null
    });

    const autocompleteInput = ref(null);

    const submitForm = async () => {
      try {
        await axios.post('http://localhost:8081/event/create', event.value);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    };

    const customFormatter = (date) => {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 00:00:00`;
    };

    return {
      event,
      autocompleteInput,
      submitForm,
      customFormatter
    };
  }
};
</script>
