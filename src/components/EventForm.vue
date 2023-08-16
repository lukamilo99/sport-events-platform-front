<template>
  <div class="container shadow bg-white rounded">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="text-center mb-4">{{ mode === 'create' ? 'Create your Event' : 'Update your Event' }}</h2>
        <form @submit.stop.prevent="handleSubmit" novalidate>
          <div class="mb-3">
            <input id="eventName" placeholder="Enter event name" type="text" v-model="event.name" required class="form-control" />
          </div>
          <div class="mb-3">
            <input id="eventCapacity" placeholder="Enter event capacity" type="number" v-model="event.capacity" required class="form-control" />
          </div>
          <div class="mb-3">
            <input id="eventSport" placeholder="Enter event sport" type="text" v-model="event.sport" required class="form-control" />
          </div>
          <div class="mb-3">
            <VueDatePicker class="form-control my-datepicker" id="eventDate" placeholder="Enter event date and time" v-model="event.date" format="dd-MM-yyyy HH:mm" datetime></VueDatePicker>
          </div>
          <div class="mb-3">
            <input id="locationSearch" placeholder="Enter event location" type="text" v-model="locationQuery" @input="searchLocations" class="form-control" />
            <div v-if="locations.length" class="dropdown-menu show position-absolute w-100">
              <div v-for="location in locations" :key="location.formattedAddress" @click="selectLocation(location)" class="dropdown-item">
                {{ location.formattedAddress }}
              </div>
            </div>
            <a @click.prevent="toggleMap" class="choose-map-link d-block mt-2 text-primary">Choose on map</a>
          </div>
          <div class="btn-container">
            <button type="submit" class="action-btn btn btn-primary">{{ mode === 'create' ? 'Create' : 'Update' }}</button>
          </div>
        </form>
        <NotificationComponent />
        <EventMap
            :mode="'create'"
            :initialLocation="initialLocation"
            :markerLocation="event.location.coordinates"
            :showMap="showMap"
            @update:showMap="toggleMap"
            @update-marker-location="updateMarkerLocation"
            @submit-location="submitLocation"
        />
      </div>
    </div>
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
import { ref, watch} from 'vue';
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
    },
    initialEvent: {
      type: Object,
      default: () => ({
        name: '',
        capacity: '',
        sport: '',
        date: '',
        location: {
          coordinates: [44.8125, 20.4612],
          formattedAddress: ''
        }
      })
    }

  },
  setup(props, { emit }) {
    const event = ref(props.initialEvent);
    const locationQuery = ref(event.value.location.formattedAddress);
    const locations = ref([]);
    const showMap = ref(false);
    const initialLocation = event.value.location.coordinates;

    const { validateNotEmpty } = useValidator();

    const validateEvent = () => {
      const nameError = validateNotEmpty(event.value.name, "Name");
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
              locationQuery.value = value.data.formattedAddress;
              event.value.location.formattedAddress = value.data.formattedAddress;
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
      event.value.location.formattedAddress = location.formattedAddress;
      event.value.location.coordinates = location.coordinates
      locationQuery.value = location.formattedAddress;
      locations.value = [];
    };

    const handleSubmit = () => {
      if (!validateEvent()) return;
      event.value.date = formatToISO(event.value.date);
      emit('submit', event.value);
    };

    const formatToISO = (dateString) => {
      return dayjs(dateString).format('YYYY-MM-DDTHH:mm:ss');
    }

    const formatToDatePicker = (isoDateString) => {
      return dayjs(isoDateString).format('dd-MM-yyyy HH:mm');
    }

    watch(() => props.initialEvent, (newEvent) => {
      if (newEvent && newEvent.date) {
        event.value.date = formatToDatePicker(newEvent.date);
      }
    }, { immediate: true });

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
.container {
  padding-top: 20px;
  padding-bottom: 20px;
}

.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.choose-map-link {
  cursor: pointer;
  text-align: center;
  display: block;
  padding: 0.5rem 0;
}

.choose-map-link:hover {
  color: #0056b3;
}
</style>

