<template>
  <div class="event-details-container container">
    <div v-if="eventDetails" class="event-item card p-4">
      <div class="header-container d-flex justify-content-between align-items-center mb-3">
        <div class="header-div"></div>

        <div class="header-div">
          <h2 class="event-title card-title">{{ eventDetails.name }}</h2>
        </div>

        <div class="header-div action-buttons">
          <button v-if="canJoinEvent" @click="joinEvent" class="action-btn btn btn-primary">Join Event</button>
          <button v-if="canLeaveEvent" @click="leaveEvent" class="action-btn btn btn-warning">Leave Event</button>
          <button v-if="isEventCreator" @click="deleteEvent" class="action-btn btn btn-danger">Delete Event</button>
        </div>
      </div>

      <p><span class="sport-icon mr-2">{{ getSportIcon(eventDetails.sport) }}</span> {{ eventDetails.sport }}</p>
      <p><span class="date-icon mr-2">📅</span> {{ formatDate(eventDetails.date) }}</p>
      <p><span class="location-icon mr-2">📍</span> {{ eventDetails.location.formattedAddress }}</p>
      <p>Capacity: {{ eventDetails.capacity }}</p>
      <p>Available Spots: {{ eventDetails.availableSpots }}</p>
      <p>Event Creator: {{ eventDetails.eventCreator.name }}</p>

      <div class="participants-dropdown dropdown">
        <button class="btn btn-light dropdown-toggle" type="button" id="participantsDropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Participants ({{ participantCount }})
        </button>
        <div class="participants-list dropdown-menu" aria-labelledby="participantsDropdown">
          <div v-for="participant in eventDetails.participants" :key="participant.id" class="participant-item dropdown-item d-flex justify-content-between align-items-center">
            {{ participant.name }}
            <button v-if="isEventCreator" @click="removeParticipant(participant.id)" class="remove-btn btn btn-sm btn-danger">Remove</button>
          </div>
        </div>
      </div>

      <button @click="showMap(eventDetails.location.coordinates[1], eventDetails.location.coordinates[0])" class="action-btn map-btn btn btn-info mt-3">🗺️ Show on map</button>
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
  components: { EventMap },
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
    const canJoinEvent = computed(() =>  !isParticipant.value);
    const canLeaveEvent = computed(() => isParticipant.value);
    const participantCount = computed(() => eventDetails.value.participants.length);

    const fetchEventDetails = async () => {
      const eventId = route.params.eventId;
      try {
        const response = await axios.get(`http://localhost:8081/event/details/${eventId}`);
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

    const removeParticipant = async (participantId) => {
      const eventId = route.params.eventId;
      try {
        await axios.delete(`http://localhost:8081/event/remove/${eventId}/${participantId}`);
        await fetchEventDetails();
      } catch (error) {
        console.error("Error removing participant:", error);
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
      participantCount,
      joinEvent,
      leaveEvent,
      deleteEvent,
      removeParticipant,
      canJoinEvent,
      canLeaveEvent,
      isEventCreator
    };
  }
}
</script>

<style scoped>
.event-details-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}

.event-item {
  text-align: center;
}

.header-div {
  flex: 1;
}

.action-buttons {
  justify-content: flex-end;
}

.sport-icon, .date-icon, .location-icon {
  margin-right: 8px;
}

.btn-warning {
  margin-right: 10px;
}

.btn-primary {
  margin-right: 10px;
}

.participants-list {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  max-height: 200px;
  overflow-y: auto;
}

.remove-btn {
  margin-left: 10px;
}

.remove-btn:hover {
  background-color: #c82333;
}
</style>
