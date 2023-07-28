<template>
  <div class="event-details-container">
    <div v-if="eventDetails" class="event-item">
      <h2 class="event-title">{{ eventDetails.name }}</h2>
      <p><span class="sport-icon">{{ getSportIcon(eventDetails.sport) }}</span> {{ eventDetails.sport }}</p>
      <p><span class="date-icon">📅</span> {{ formatDate(eventDetails.date) }}</p>
      <p><span class="location-icon">📍</span> {{ eventDetails.streetName }}, {{ eventDetails.city }}</p>
      <p>Capacity: {{ eventDetails.capacity }}</p>
      <p>Available Spots: {{ eventDetails.availableSpots }}</p>
      <p>Event Creator: {{ eventDetails.eventCreator.name }}</p>
      <ul>
        <li v-for="participant in eventDetails.participants" :key="participant.id">
          {{ participant.name }}
        </li>
      </ul>
      <button v-if="canJoinEvent" @click="joinEvent">Join Event</button>
      <button v-if="canLeaveEvent" @click="leaveEvent">Leave Event</button>
      <button v-if="isEventCreator" @click="deleteEvent">Delete Event</button>
      <button @click="showMap(eventDetails.coordinatesLat, eventDetails.coordinatesLon)" class="map-btn">🗺️ Show on map</button>
    </div>
    <EventMap
        :mode="'view'"
        v-if="showMapModal"
        :initialLocation="[currentLat, currentLon]"
        :markerLocation="[currentLat, currentLon]"
        :showMap="showMapModal"
        @update:showMap="showMapModal = $event"
        @submit-location="showMapModal = false"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import EventMap from "@/components/EventMap.vue";
import router from "@/router/router";

export default {
  components: {EventMap},
  setup() {
    const route = useRoute();
    const store = useStore();
    const eventDetails = ref(null);
    const showMapModal = ref(false);
    const currentLat = ref(null);
    const currentLon = ref(null);

    const userId = computed(() => store.getters.userId);

    const isEventCreator = computed(() => eventDetails.value && eventDetails.value.eventCreator.id === userId.value);
    const isParticipant = computed(() => eventDetails.value && eventDetails.value.participants.some(p => p.id === userId.value));
    const canJoinEvent = computed(() => !isEventCreator.value && !isParticipant.value);
    const canLeaveEvent = computed(() => !isEventCreator.value && isParticipant.value);

    const fetchEventDetails = async () => {
      const eventId = route.params.eventId;
      try {
        const response = await axios.get(`http://localhost:8081/event/${eventId}`);
        eventDetails.value = response.data;
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    onMounted(fetchEventDetails);

    const getSportIcon = (sport) => {
      switch (sport.toLowerCase()) {
        case 'football': return '⚽';
        case 'basketball': return '🏀';
        case 'tennis': return '🎾';
        case 'baseball': return '⚾';
        case 'volleyball': return '🏐';
        case 'beach volleyball': return '🏖️🏐';
        default: return '';
      }
    };

    const formatDate = (dateArray) => {
      const [year, month, day, hour, minute] = dateArray;
      return `${day}.${month}.${year} ${hour}:${minute.toString().padStart(2, '0')}`;
    };

    const showMap = (lat, lon) => {
      currentLat.value = lat;
      currentLon.value = lon;
      showMapModal.value = true;
    };

    const joinEvent = async () => {
      const eventId = route.params.eventId;
      try {
        await axios.post(`http://localhost:8081/event/join/${eventId}`);
        await fetchEventDetails();
      } catch (error) {
        console.error("Error joining event:", error);
      }
    };

    const leaveEvent = async () => {
      const eventId = route.params.eventId;
      try {
        await axios.post(`http://localhost:8081/event/leave/${eventId}`);
        await fetchEventDetails();
      } catch (error) {

        console.error("Error leaving event:", error);
      }
    };

    const deleteEvent = async () => {
      const eventId = route.params.eventId;
      try {
        await axios.delete(`http://localhost:8081/event/delete/${eventId}`);
        await router.push('/home');
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    };

    return {
      eventDetails,
      getSportIcon,
      formatDate,
      showMap,
      showMapModal,
      currentLat,
      currentLon,
      joinEvent,
      leaveEvent,
      deleteEvent,
      isEventCreator,
      canJoinEvent,
      canLeaveEvent
    };
  }
}
</script>

<style scoped>
.event-details-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.event-item {
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.event-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.map-btn {
  margin-top: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 25px;
  background-color: #007BFF;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

.map-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>
