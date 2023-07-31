<template>
  <div class="form-container">
    <form @submit.stop.prevent="handleSubmit">
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
          :mode="mode"
          :initialLocation="initialLocation"
          :markerLocation="event.location.coordinates"
          :showMap="showMap"
          @update:showMap="toggleMap"
          @update-marker-location="updateMarkerLocation"
          @submit-location="submitLocation"
      />
      <button type="submit">{{ mode === 'create' ? 'Create' : 'Update' }}</button>
    </form>
    <NotificationComponent/>
  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import dayjs from "dayjs";
import EventMap from "@/components/EventMap.vue";
import NotificationComponent from "@/components/NotificationComponent.vue";
import axios from "axios";
import {store} from "@/store/store";
import {computed, ref} from 'vue';
import { debounce } from 'lodash';
import {useValidator} from "@/validator/validator";

export default {
  components: {
    NotificationComponent,
    VueDatePicker,
    EventMap
  },
  props: {
    mode: {
      type: String,
      default: 'create'
    }
  },
  setup(props, { emit }) {
    const event = computed(() => store.getters.event);
    const locationQuery = ref(event.value.location.formatted);
    const locations = ref([]);
    const showMap = ref(false);
    const initialLocation = [45.2671, 19.8335];
    const { validateNotEmpty } = useValidator();

    const validateEvent = () => {
      const nameError = validateNotEmpty(event.value.name);
      if (nameError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: nameError
        });
        return false;
      }

      const capacityError = validateNotEmpty(event.value.capacity, "Capacity");
      if (capacityError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: capacityError
        });
        return false;
      }

      const sportError = validateNotEmpty(event.value.sport, "Sport");
      if (sportError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: sportError
        });
        return false;
      }

      const locationError = validateNotEmpty(event.value.location, "Location");
      if (locationError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: locationError
        });
        return false;
      }

      const dateError = validateNotEmpty(event.value.date, "Date");
      if (dateError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: dateError
        });
        return false;
      }
      return true;
    };

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
    }, 100);

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
    }, 100);

    const toggleMap = () => {
      showMap.value = !showMap.value;
    };

    const updateMarkerLocation = (coordinates) => {
      event.value.location.coordinates = coordinates;
    };

    const submitLocation = () => {
      fetchLocationFromCoordinates();
      toggleMap();
    };

    const selectLocation = (location) => {
      event.value.location.formatted = location.formatted;
      event.value.location.coordinates = location.coordinates
      locationQuery.value = location.formatted;
      locations.value = [];
    };

    const handleSubmit = () => {
      if (!validateEvent()) return;
      event.value.date = formatToISO(event.value.date);
      console.log(event.value)
      emit('submit', event.value);
    };

    const formatToISO = (dateString) => {
      return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
    }

    return {
      event,
      locationQuery,
      locations,
      showMap,
      handleSubmit,
      toggleMap,
      searchLocations,
      updateMarkerLocation,
      selectLocation,
      submitLocation,
      initialLocation
    };
  }
};
</script>

<style scoped>
.form-container {
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
</style>
