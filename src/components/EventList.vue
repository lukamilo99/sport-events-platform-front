<template>
  <div class="list-container container">
    <div class="row">
      <div v-for="event in events" :key="event.id" class="col-md-4">
        <div class="card h-100">
          <div class="card-body d-flex flex-column justify-content-center align-items-center">
          <router-link :to="`/event/${event.name}/${event.id}`" class="event-title card-title">{{ event.name }}</router-link>
            <p class="card-text"><span class="sport-icon">{{ getSportIcon(event.sport) }}</span> {{ event.sport }}</p>
            <p class="card-text"><span class="date-icon">📅</span> {{ formatDate(event.date) }}</p>
            <p class="card-text"><span class="location-icon">📍</span> {{ event.location.formattedAddress }}</p>
            <button @click="showMap(event.location.coordinates[1], event.location.coordinates[0])" class="btn btn-primary">🗺️ Show on map</button>
          </div>
        </div>
      </div>
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
.container {
  padding: 0 !important;
}

.event-title {
  color: inherit;
  text-decoration: none;
  font-size: 1.8em;
  font-weight: bold;
  transition: color 0.3s;
  margin-bottom: 20px;
  text-align: center;
}

.card-text {
  font-size: 1.1em;
  margin: 10px 0;
}

.sport-icon,
.date-icon,
.location-icon {
  margin-right: 10px;
}

.btn.btn-primary {
  margin-top: 20px;
}
</style>



