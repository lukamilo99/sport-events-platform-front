<template>
  <div class="main-container container mt-5">
    <section class="content-section p-4 mb-4 bg-light rounded">
      <h2 class="section-title h3 mb-3">Find Your Event</h2>
      <div class="row">
        <div class="col-md-3 mb-2">
          <input v-model="searchQuery" placeholder="Search by event name" @input="updateSearch" class="form-control" />
        </div>
        <div class="col-md-2 mb-2">
          <select v-model="selectedCity" @change="updateSearch(true)" class="form-control">
            <option value="" disabled>City</option>
            <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>
        <div class="col-md-2 mb-2">
          <select v-model="selectedSport" @change="updateSearch(true)" class="form-control">
            <option value="" disabled>Sport</option>
            <option v-for="sport in sports" :key="sport" :value="sport">{{ sport }}</option>
          </select>
        </div>
        <div class="col-md-2 mb-2">
          <select v-model="selectedDay" @change="updateSearch(true)" class="form-control">
            <option value="" disabled>Day</option>
            <option value="today">Today</option>
            <option value="next5days">1-5 days</option>
            <option value="fromDay5to10">5-10 days</option>
            <option value="afterDay10">10+ days</option>
          </select>
        </div>
        <div class="col-md-3">
          <button @click="resetFilters" class="btn btn-danger w-100">Reset Filters</button>
        </div>
      </div>
    </section>

    <section class="content-section p-4 mb-4 bg-light rounded">
      <h2 class="section-title h3 mb-3">Results</h2>
      <div class="row">
        <EventList v-if="events.length" :events="events" />
        <p v-else class="no-results">No results</p>
        <div class="d-flex justify-content-between mt-4" v-if="events.length">
          <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-primary">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPageCount" class="btn btn-primary">Next</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {ref, onMounted, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import EventList from "@/components/EventList.vue";

export default {
  components: {
    EventList
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const events = ref([]);
    const searchQuery = ref("");
    const selectedCity = ref("");
    const selectedSport = ref("");
    const selectedDay = ref("");
    const customDay = ref(0);
    const currentPage = ref(1);
    const totalPageCount = ref(0);

    const cities = ["Belgrade", "Novi Sad", "Nis"];
    const sports = ["Football", "Basketball", "Tennis"];

    onMounted(() => {
      fetchEvents(route.query);
    });

    watch(() => route.query, newQuery => {
      fetchEvents(newQuery);
    });

    const fetchEvents = async (query = {}) => {
      try {
        const response = await axios.get(`http://localhost:8081/event/search-events`, {
          params: {
            ...query,
            page: currentPage.value - 1
          }
        });
        events.value = response.data.events;
        totalPageCount.value = Math.ceil(response.data.totalCount / 6);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const updateSearch = (resetPage = false) => {
      let queryParams = {};

      if (searchQuery.value) {
        queryParams.search = searchQuery.value;
      }
      if (selectedCity.value) {
        queryParams.city = selectedCity.value;
      }
      if (selectedSport.value) {
        queryParams.sport = selectedSport.value;
      }
      if (selectedDay.value === 'custom') {
        queryParams.day = customDay.value;
      } else if (selectedDay.value) {
        queryParams.day = selectedDay.value;
      }

      if (resetPage) {
        currentPage.value = 1;
      }

      router.push({
        path: `/events`,
        query: { ...queryParams, page: currentPage.value }
      });
    };

    const resetFilters = () => {
      searchQuery.value = "";
      selectedCity.value = "";
      selectedSport.value = "";
      selectedDay.value = "";
      customDay.value = 0;

      router.push({
        path: `/events`,
        query: { page: 1 }
      });
      fetchEvents();
      currentPage.value = 1;
    };

    const nextPage = () => {
      if (currentPage.value < totalPageCount.value) {
        currentPage.value++;
        updateSearch();
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        updateSearch();
      }
    };

    return {
      events,
      searchQuery,
      selectedCity,
      selectedSport,
      selectedDay,
      customDay,
      cities,
      sports,
      currentPage,
      totalPageCount,
      updateSearch,
      resetFilters,
      nextPage,
      prevPage
    };
  },
};
</script>

<style scoped>
.main-container {
  margin-top: 5rem;
  padding: 2rem 0;
  min-height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.content-section {
  background-color: #ffffff;
  padding: 2rem;
  margin: 0 2rem 2rem 2rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
}

.no-results {
  text-align: center;
  color: #999;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
