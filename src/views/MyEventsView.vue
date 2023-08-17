<template>
  <div class="events-view container bg-white p-4 rounded shadow">
    <ProfileNavigationComponent />
    <h2 class="my-3">Events</h2>
    <div class="btn-group mb-3" role="group">
      <button
          type="button"
          class="btn btn-primary"
          :class="{ 'active': currentView === 'created' }"
          @click="loadUserEvents('created')">My Created Events</button>
      <button
          type="button"
          class="btn btn-primary"
          :class="{ 'active': currentView === 'participating' }"
          @click="loadUserEvents('participating')">Events I'm Participating In</button>
    </div>
    <div class="mb-3">
      <input type="checkbox" id="includePastEvents" v-model="includePastEvents" />
      <label for="includePastEvents">Include past events</label>
    </div>
    <ul class="list-unstyled">
      <li v-for="event in currentEvents" :key="event.id" class="py-2 border-bottom">
        <div class="event-item">
        <span :class="{ 'label-past': event.eventPast, 'label-upcoming': !event.eventPast }">
          {{ event.eventPast ? 'Past' : 'Upcoming' }}
        </span>
          {{ event.name }}
          <div class="event-actions">
            <button v-if="currentView === 'created'" @click="editEvent(event.id)" class="btn btn-sm btn-warning">Edit</button>
            <button v-if="currentView === 'created'" @click="deleteEvent(event.id)" class="btn btn-sm btn-danger ml-2">Delete</button>
            <button v-if="currentView === 'participating'" @click="leaveEvent(event.id)" class="btn btn-sm btn-secondary ml-2">Leave</button>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="currentEvents.length" class="d-flex justify-content-between mt-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-primary">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPageCount" class="btn btn-primary">Next</button>
    </div>
    <p v-else class="no-results text-center text-muted my-4">No results</p>
  </div>
</template>

<script>
import {ref, onMounted, watch} from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ProfileNavigationComponent from "@/components/ProfileNavigationComponent.vue";

export default {
  components: { ProfileNavigationComponent },
  setup() {
    const router = useRouter();
    const events = ref([]);
    const currentPage = ref(1);
    const totalPageCount = ref(0);
    const currentView = ref('created');
    const includePastEvents = ref(false);

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
            page: currentPage.value - 1,
            includePastEvents: includePastEvents.value
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
            page: currentPage.value - 1,
            includePastEvents: includePastEvents.value
          }
        });
        events.value = response.data.events;
        totalPageCount.value = Math.ceil(response.data.totalCount / 6);
      } catch (error) {
        console.error("Error fetching participated events:", error);
      }
    };

    const editEvent = (eventId) => {
      router.push(`/edit-event/${eventId}`);
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

    watch(includePastEvents, () => {
      currentPage.value = 1;
      loadUserEvents(currentView.value);
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
      includePastEvents
    };
  }
};
</script>

<style scoped>
.events-view {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.btn-warning {
  margin-right: 10px;
}

.label-past {
  background-color: red;
  color: white;
  padding: 3px 6px;
  border-radius: 5px;
  margin-right: 8px;
}

.label-upcoming {
  background-color: green;
  color: white;
  padding: 3px 6px;
  border-radius: 5px;
  margin-right: 8px;
}

.label-past, .label-upcoming {
  display: inline-block;
  width: 80px;
  height: 25px;
  text-align: center;
}

.event-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.event-actions {
  display: flex;
  align-items: center;
}
</style>


