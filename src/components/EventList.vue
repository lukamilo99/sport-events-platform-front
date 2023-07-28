<template>
  <div class="events-grid">
    <div v-for="event in events" :key="event.id" class="event-item">
      <router-link :to="`/event/${event.name}/${event.id}`" class="event-title">{{ event.name }}</router-link>
      <p><span class="sport-icon">{{ getSportIcon(event.sport) }}</span> {{ event.sport }}</p>
      <p><span class="date-icon">📅</span> {{ formatDate(event.date) }}</p>
      <p><span class="location-icon">📍</span> {{ event.streetName }}, {{ event.city }}</p>
      <button @click="showMap(event.coordinatesLat, event.coordinatesLon)" class="map-btn">🗺️ Show on map</button>
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
import { ref } from 'vue';
import EventMap from "@/components/EventMap.vue";

export default {
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  components: {
    EventMap
  },
  setup() {
    const showMapModal = ref(false);
    const currentLat = ref(null);
    const currentLon = ref(null);

    const showMap = (lat, lon) => {
      currentLat.value = lat;
      currentLon.value = lon;
      showMapModal.value = true;
    };

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

    return {
      showMap,
      showMapModal,
      currentLat,
      currentLon,
      getSportIcon,
      formatDate
    };
  }
}
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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

.event-title {
  font-size: 1.5rem;
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
}

.event-title:hover {
  color: #007BFF;
}
</style>


