<template>
  <div class="events-container">
    <h2>Events</h2>

    <div v-if="events && events.length">
      <div v-for="event in events" :key="event.id" class="event-item">
        <h3>{{ event.name }}</h3>
        <p><strong>Sport:</strong> {{ event.sport }}</p>
        <p><strong>Location:</strong> {{ event.location }}</p>
        <p><strong>Date:</strong> {{ event.date }}</p>
      </div>
    </div>

    <p v-else class="no-events">No events available</p>

    <button @click="goToCreateEvent" class="create-event-btn">Create New Event</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

export default {
  setup() {
    const events = ref([]);
    const currentPage = ref(0);
    const pageSize = ref(10);
    const router = useRouter();

    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/event/all?page=${currentPage.value}&size=${pageSize.value}`);
        if(response.ok) {
          const responseData = await response.json();
          events.value = responseData.content;
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    onMounted(fetchEvents);

    const goToCreateEvent = () => {
      router.push('/create-event');
    };

    return {
      events,
      goToCreateEvent
    };
  },
}
</script>


<style scoped>
.events-container {
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  margin: 2rem 0;
}

h2 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.event-item {
  background-color: #f9f9f9;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}

.no-events {
  text-align: center;
  margin: 2rem 0;
}

.create-event-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  border-radius: 5px;
  display: block;
  margin: 1rem auto;
}

.create-event-btn:hover {
  background-color: #0056b3;
}
</style>
