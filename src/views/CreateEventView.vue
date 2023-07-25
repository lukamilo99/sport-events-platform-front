<template>
  <div class="create-event-container">
    <h2>Create New Event</h2>

    <form @submit.prevent="submitForm">
      <div>
        <label for="eventName">Name:</label>
        <input id="eventName" type="text" v-model="event.name" required />
      </div>
      <div>
        <label for="eventCapacity">Capacity:</label>
        <input id="eventCapacity" type="number" v-model="event.capacity" required />
      </div>
      <div>
        <label for="eventSport">Sport:</label>
        <input id="eventSport" type="text" v-model="event.sport" required />
      </div>
      <div>
        <label for="eventDate">Date and Time:</label>
        <VueDatePicker id="eventDate" v-model="event.date" format="dd-MM-yyyy HH:mm" datetime></VueDatePicker>
      </div>
      <div>
        <label for="locationSearch">Location:</label>
        <input id="locationSearch" type="text" v-model="locationQuery" @input="searchLocations" />
        <div v-if="locations.length" class="dropdown">
          <div v-for="location in locations" :key="location.formatted" @click="selectLocation(location)">
            {{ location.formatted }}
          </div>
        </div>
      </div>
      <span @click.prevent="toggleMap" class="choose-map-link">Choose on map</span>
      <div v-if="showMap" class="map-modal-overlay" @click="toggleMap">
        <div class="map-modal" @click.stop>
          <div class="map-container">
            <l-map :zoom="13" :center="initialLocation" @ready="handleMapReady">
              <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"></l-tile-layer>
              <l-marker :lat-lng="event.location.coordinates"></l-marker>
            </l-map>
          </div>
          <button @click.prevent="submitLocation">Submit location</button>
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { ref } from 'vue';
import axios from "axios";
import { debounce } from 'lodash';

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    VueDatePicker
  },
  setup() {
    const event = ref({
      name: '',
      capacity: null,
      sport: '',
      location: {
        formatted: '',
        coordinates: [45.2671, 19.8335]
      },
      date: null
    });
    const initialLocation = [45.2671, 19.8335];
    const locationQuery = ref('');
    const locations = ref([]);
    const showMap = ref(false);

    const handleMapReady = (mapInstance) => {
      mapInstance.on('click', async function(e) {
        event.value.location.coordinates = [e.latlng.lat, e.latlng.lng];
      });
    };

    const selectLocation = (location) => {
      event.value.location.formatted = location.formatted;
      locationQuery.value = location.formatted;
      locations.value = [];
    };

    const fetchLocationFromCoordinates = debounce(async () => {
      try {
        const lat = event.value.location.coordinates[0];
        const lon = event.value.location.coordinates[1];
        await axios.get('http://localhost:8081/geo/address', { params: { lat, lon } })
            .then(value => {
              locationQuery.value = value.data.formatted;
              event.value.location.coordinates = value.data.coordinates;
            });
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    }, 300);

    const searchLocations = debounce(async () => {
      if (!locationQuery.value.trim()) {
        locations.value = [];
        return;
      }

      try {
        await axios.get('http://localhost:8081/geo/autocomplete', { params: { query: locationQuery.value } })
            .then(value => {
              locations.value = value.data;
            });

      } catch (error) {
        console.error('Error searching location:', error);
      }
    }, 300);

    const submitForm = async () => {
      try {
        await axios.post('http://localhost:8081/event/create', event.value);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    };

    const toggleMap = () => {
      showMap.value = !showMap.value;
    };

    const submitLocation = () => {
      fetchLocationFromCoordinates();
      toggleMap();
    };

    return {
      event,
      initialLocation,
      locationQuery,
      locations,
      handleMapReady,
      searchLocations,
      selectLocation,
      submitForm,
      toggleMap,
      showMap,
      submitLocation
    };
  }
};
</script>

<style scoped>
.create-event-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
}

div {
  margin-bottom: 15px;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, VueDatePicker {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  width: 80%;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 25px;
  background-color: #28a745;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 10px auto;
  display: block;
}

.dropdown {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.dropdown div {
  padding: 8px;
  cursor: pointer;
}

.dropdown div:hover {
  background-color: #f7f7f7;
}

.choose-map-link {
  color: #007BFF;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s;
}

.choose-map-link:hover {
  color: #0056b3;
}

button:hover {
  transform: scale(1.05);
  background-color: #217c3b;
}

.map-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.map-modal {
  width: 70%;
  height: 60%;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.map-container {
  height: calc(100% - 50px);
  width: 100%;
  overflow: hidden;
}
</style>




