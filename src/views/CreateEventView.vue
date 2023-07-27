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
      <EventMap
          :mode="'create'"
          :initialLocation="initialLocation"
          :markerLocation="event.location.coordinates"
          :showMap="showMap"
          @update:showMap="toggleMap"
          @update-marker-location="updateMarkerLocation"
          @submit-location="submitLocation"
      />
      <button @click.prevent="submitForm">Submit</button>
    </form>
    <div v-if="confirmationMessage" class="confirmation-message">
      {{ confirmationMessage }}
    </div>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {ref} from 'vue';
import axios from "axios";
import {debounce} from 'lodash';
import {useValidator} from "@/validator/validator";
import dayjs from "dayjs";
import EventMap from "@/components/EventMap.vue";

export default {
  components: {
    VueDatePicker,
    EventMap
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
    const eventError = ref('');
    const isValidAddress = ref(false);
    const confirmationMessage = ref('');
    const { validateNotEmpty, validateAddress } = useValidator();

    const validateEvent = () => {
      const nameError = validateNotEmpty(event.value.name, "Name");
      if (nameError) {
        eventError.value = nameError;
        return false;
      }

      const capacityError = validateNotEmpty(event.value.capacity, "Capacity");
      if (capacityError) {
        eventError.value = capacityError;
        return false;
      }

      const sportError = validateNotEmpty(event.value.sport, "Sport");
      if (sportError) {
        eventError.value = sportError;
        return false;
      }

      const locationError = validateNotEmpty(event.value.location, "Location");
      if (locationError) {
        eventError.value = locationError;
        return false;
      }

      const dateError = validateNotEmpty(event.value.date, "Date");
      if (dateError) {
        eventError.value = dateError;
        return false;
      }

      const addressError = validateAddress(isValidAddress, "Address");
      if (addressError) {
        eventError.value = addressError;
        return false;
      }
      return true;
    };

    const handleMapReady = (mapInstance) => {
      mapInstance.on('click', async function(e) {
        event.value.location.coordinates = [e.latlng.lat, e.latlng.lng];
      });
    };

    const updateMarkerLocation = (newLocation) => {
      event.value.location.coordinates = newLocation;
    };

    const selectLocation = (location) => {
      isValidAddress.value = true;
      event.value.location.formatted = location.formatted;
      event.value.location.coordinates = location.coordinates
      locationQuery.value = location.formatted;
      locations.value = [];
    };

    const formatToISO = (dateString) => {
      return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
    }

    const toggleMap = () => {
      showMap.value = !showMap.value;
    };

    const resetForm = () => {
      event.value = {
        name: '',
        capacity: null,
        sport: '',
        location: {
          formatted: '',
          coordinates: [45.2671, 19.8335]
        },
        date: null
      };
      locationQuery.value = '';
    };

    const handleSuccessfulResponse = (response) => {
      if (response.status === 200) {
        confirmationMessage.value = "Event successfully created!";
        resetForm();
      }
      setTimeout(() => {
        confirmationMessage.value = '';
      }, 2000);
    };

    const fetchLocationFromCoordinates = debounce(async () => {
      try {
        const lat = event.value.location.coordinates[0];
        const lon = event.value.location.coordinates[1];
        await axios.get('http://localhost:8081/geo/address',
            { params: { lat, lon } })
            .then(value => {
              locationQuery.value = value.data.formatted;
              event.value.location.formatted = value.data.formatted;
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
      isValidAddress.value = false;

      try {
        await axios.get('http://localhost:8081/geo/autocomplete', { params: { query: locationQuery.value } })
            .then(value => {
              locations.value = value.data;
            });

      } catch (error) {
        console.error('Error searching location:', error);
      }
    }, 300);

    const submitLocation = () => {
      fetchLocationFromCoordinates();
      toggleMap();
    };

    const submitForm = async () => {
      if (validateEvent()) return;
      event.value.date = formatToISO(event.value.date);
      try {
        const response = await axios.post('http://localhost:8081/event/create', event.value);
        handleSuccessfulResponse(response);
      } catch (error) {
        console.error('Error creating event:', error);
      }
    };

    return {
      event,
      initialLocation,
      locationQuery,
      locations,
      handleMapReady,
      searchLocations,
      confirmationMessage,
      selectLocation,
      submitForm,
      toggleMap,
      showMap,
      submitLocation,
      updateMarkerLocation
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
  display: block;
  margin-top: 10px;
}

.choose-map-link:hover {
  color: #0056b3;
}

.confirmation-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 5px;
  margin-top: 15px;
  text-align: center;
}
</style>