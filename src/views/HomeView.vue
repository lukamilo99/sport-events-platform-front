<template>
  <div class="container shadow">
    <section class="content-section p-4 mb-4 bg-light">
      <h2 class="section-title mb-4">Discover & Create</h2>
      <div class="action-wrapper d-flex flex-column align-items-center">
        <div class="icon-filters d-flex gap-2 mb-3">
          <button @click="redirectToEvents('sport', 'Football')" class="icon-btn btn btn-light btn-circle">⚽</button>
          <button @click="redirectToEvents('sport', 'Basketball')" class="icon-btn btn btn-light btn-circle">🏀</button>
          <button @click="redirectToEvents('sport', 'Tennis')" class="icon-btn btn btn-light btn-circle">🎾</button>
          <button @click="redirectToEvents('city', 'Belgrade')" class="icon-btn btn btn-light btn-circle">🏙️</button>
          <button @click="redirectToEvents('city', 'Novi_sad')" class="icon-btn btn btn-light btn-circle">🌆</button>
          <button @click="redirectToEvents('city', 'Nis')" class="icon-btn btn btn-light btn-circle">🌄</button>
        </div>
        <div class="buttons-wrapper d-flex justify-content-between w-100">
          <button @click="viewAllEvents" class="action-btn btn btn-primary">View All Events</button>
          <button @click="createEvent" class="action-btn btn btn-primary">Create Your Event</button>
        </div>
      </div>
    </section>

    <section class="content-section p-4 mb-4 bg-light">
      <h2 class="section-title mb-4">
        Latest Events {{ userLocation ? `in ${userLocation}` : '' }}
      </h2>
      <div class="row">
        <EventsList :events="events" />
      </div>
    </section>
  </div>
</template>


<script>
import EventsList from '../components/EventList.vue';
import {ref, onMounted, computed} from 'vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import {useStore} from "vuex";

export default {
  components: {
    EventsList
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const events = ref([]);
    const userLocation = computed(() => store.getters['userLocation']);

    const fetchLatestEvents = async () => {
      const params = {};

      if (userLocation.value) {
        params.location = userLocation.value;
      }

      try {
        const response = await axios.get('http://localhost:8081/event/latest', { params });
        events.value = response.data;
      } catch (error) {
        console.error("Error fetching recent events:", error);
      }
    }

    onMounted(fetchLatestEvents);

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
      userLocation,
      redirectToEvents,
      createEvent,
      viewAllEvents
    };
  },
};
</script>

<style scoped>
.container {
  align-items: center;
  padding: 2rem 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.content-section {
  background-color: #ffffff;
  padding: 2rem;
  margin: 0 2rem 2rem 2rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.icon-btn {
  transition: background-color 0.3s;
}

.icon-btn:hover {
  background-color: #d1d1d1;
}

.buttons-wrapper {
  max-width: 400px;
}
</style>


