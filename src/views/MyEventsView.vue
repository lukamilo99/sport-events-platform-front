<template>
  <div class="events-view">
    <ProfileNavigationComponent />
    <h2>Events</h2>
    <div class="btn-group">
      <button
          :class="{ active: currentView === 'created' }"
          @click="loadUserEvents('created')">My Created Events</button>
      <button
          :class="{ active: currentView === 'participating' }"
          @click="loadUserEvents('participating')">Events I'm Participating In</button>
    </div>

    <ul v-if="currentEvents.length">
      <li v-for="event in currentEvents" :key="event.id">
        {{ event.name }}
        <button v-if="currentView === 'created'" @click="editEvent(event)">Edit</button>
        <button v-if="currentView === 'created'" @click="deleteEvent(event.id)">Delete</button>
        <button v-if="currentView === 'participating'" @click="leaveEvent(event.id)">Leave</button>
      </li>
    </ul>

    <div v-if="currentEvents.length" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
      <button @click="nextPage" :disabled="currentPage >= totalPageCount">Next</button>
    </div>
    <p v-else class="no-results">No results</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProfileNavigationComponent from "@/components/ProfileNavigationComponent.vue";
import { useStore } from 'vuex';

export default {
  components: { ProfileNavigationComponent },
  setup() {
    const store = useStore()
    const router = useRouter();
    const events = ref([]);
    const currentPage = ref(1);
    const totalPageCount = ref(0);
    const currentView = ref('created');

    const loadUserEvents = async (viewType) => {
      currentView.value = viewType;
      if (viewType === 'created') {
        await fetchUserCreatedEvents();
      } else {
        await fetchUserParticipatedEvents();
      }
    };

    const fetchUserCreatedEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/event/user-creator`, {
          params: {
            page: currentPage.value - 1
          }
        });
        events.value = response.data.events;
        totalPageCount.value = Math.ceil(response.data.totalCount / 6);
      } catch (error) {
        console.error("Error fetching created events:", error);
      }
    };

    const fetchUserParticipatedEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/event/user-participant`, {
          params: {
            page: currentPage.value - 1
          }
        });
        events.value = response.data.events;
        totalPageCount.value = Math.ceil(response.data.totalCount / 6);
      } catch (error) {
        console.error("Error fetching participated events:", error);
      }
    };

    const editEvent = (event) => {
      store.dispatch('selectEvent', event);
      router.push('/edit-event');
    };

    const deleteEvent = async (eventId) => {
      try {
        await axios.delete(`http://localhost:8081/event/delete/${eventId}`);
        await loadUserEvents(currentView.value);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    };

    const leaveEvent = async (eventId) => {
      try {
        await axios.post(`http://localhost:8081/event/leave/${eventId}`);
        await loadUserEvents(currentView.value);
      } catch (error) {
        console.error("Error leaving event:", error);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPageCount.value) {
        currentPage.value++;
        loadUserEvents(currentView.value);
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        loadUserEvents(currentView.value);
      }
    };

    onMounted(() => {
      fetchUserCreatedEvents();
    });

    return {
      currentEvents: events,
      loadUserEvents,
      editEvent,
      deleteEvent,
      leaveEvent,
      nextPage,
      prevPage,
      currentPage,
      totalPageCount,
      currentView,
    };
  }
};
</script>

<style scoped>
.events-view {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.btn-group button {
  padding: 8px 16px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-group button:hover {
  background-color: #0056b3;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

li:last-child {
  border-bottom: none;
}

.btn-group button.active {
  background-color: #0056b3;
  font-weight: bold;
}
</style>

