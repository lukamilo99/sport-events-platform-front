<template>
  <div class="event-details-container">
    <div v-if="eventDetails" class="event-item">
      <div class="header-container">
        <div class="header-div"></div>

        <div class="header-div">
          <h2 class="event-title">{{ eventDetails.name }}</h2>
        </div>

        <div class="header-div action-buttons">
          <button v-if="canJoinEvent" @click="joinEvent" class="action-btn">Join Event</button>
          <button v-if="canLeaveEvent" @click="leaveEvent" class="action-btn">Leave Event</button>
          <button v-if="isEventCreator" @click="deleteEvent" class="action-btn">Delete Event</button>
        </div>
      </div>

      <p><span class="sport-icon">{{ getSportIcon(eventDetails.sport) }}</span> {{ eventDetails.sport }}</p>
      <p><span class="date-icon">📅</span> {{ formatDate(eventDetails.date) }}</p>
      <p><span class="location-icon">📍</span> {{ eventDetails.location.formattedAddress }} </p>
      <p>Capacity: {{ eventDetails.capacity }}</p>
      <p>Available Spots: {{ eventDetails.availableSpots }}</p>
      <p>Event Creator: {{ eventDetails.eventCreator.name }}</p>

      <div class="participants-dropdown" @click="toggleParticipantsList">
        Participants ({{ participantCount }})
        <div v-if="showParticipantsList" class="participants-list">
          <div v-for="participant in eventDetails.participants" :key="participant.id" class="participant-item">
            {{ participant.name }}
            <button v-if="isEventCreator" @click="removeParticipant(participant.id)" class="remove-btn">Remove</button>
          </div>
        </div>
      </div>

      <button @click="showMap(eventDetails.location.coordinates[1], eventDetails.location.coordinates[0])" class="action-btn map-btn">🗺️ Show on map</button>
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
    const showParticipantsList = ref(false);

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

    const toggleParticipantsList = () => {
      showParticipantsList.value = !showParticipantsList.value;
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
      isEventCreator,
      showParticipantsList,
      toggleParticipantsList
    };
  }
}
</script>

<style scoped>
.event-details-container,
.event-item {
  text-align: center;
}

.event-details-container {
  margin: 100px auto;
  max-width: 600px;
}

.event-item {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-div {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-buttons {
  justify-content: flex-end;
}

.action-btn, .map-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 5px;
  background-color: #007bff;
  color: #fff;
}

.action-btn:hover, .map-btn:hover {
  background-color: #0056b3;
}

.map-btn {
  display: block;
  margin: 20px auto 0;
}

.participants-dropdown {
  position: relative;
  cursor: pointer;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #ffffff;
  transition: background-color 0.3s;
}

.participants-dropdown:hover {
  background-color: #f7f7f7;
}

.participants-list {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-top: 5px;
  z-index: 10;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.participant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-btn {
  margin-left: 10px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 3px 7px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background-color: #c82333;
}
</style>