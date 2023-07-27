<template>
  <div class="home-container">
    <section class="action-section">
      <h2 class="section-title">Discover & Create</h2>
      <div class="action-wrapper">
        <div class="icon-filters">
          <button @click="redirectToEvents('sport', 'Football')" class="icon-btn">⚽</button>
          <button @click="redirectToEvents('sport', 'Basketball')" class="icon-btn">🏀</button>
          <button @click="redirectToEvents('sport', 'Tennis')" class="icon-btn">🎾</button>
          <button @click="redirectToEvents('city', 'Belgrade')" class="icon-btn">🏙️</button>
          <button @click="redirectToEvents('city', 'Novi_sad')" class="icon-btn">🌆</button>
          <button @click="redirectToEvents('city', 'Nis')" class="icon-btn">🌄</button>
        </div>
        <div class="buttons-wrapper">
          <button @click="viewAllEvents" class="action-btn">View All Events</button>
          <button @click="createEvent" class="action-btn">Create Your Event</button>
        </div>
      </div>
    </section>
    <section class="latest-events-section">
      <h2 class="section-title">Latest Events</h2>
      <EventsList :events="events" />
    </section>
  </div>
</template>

<script>
import EventsList from '../components/EventList.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";

export default {
  components: {
    EventsList
  },
  setup() {
    const router = useRouter();
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

    const createEvent = () => {
      router.push('/create-event');
    };

    const viewAllEvents = () => {
      router.push('/events');
    };

    return {
      events,
      redirectToEvents,
      createEvent,
      viewAllEvents
    };
  },
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
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

.action-section {
  background-color: #f8f9fa;
  padding: 20px 5%;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 70px;
}

.latest-events-section {
  background-color: #f8f9fa;
  padding: 20px 5%;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 20px;
}

.action-wrapper {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}
</style>

