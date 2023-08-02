<template>
  <div class="events-container">
    <section class="search-section">
      <h2 class="section-title">Find Your Event</h2>
      <div class="search-wrapper">
        <input v-model="searchQuery" placeholder="Search by event name" @input="updateSearch" />
        <select v-model="selectedCity" @change="updateSearch(true)">
          <option value="" disabled>City</option>
          <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
        </select>
        <select v-model="selectedSport" @change="updateSearch(true)">
          <option value="" disabled>Sport</option>
          <option v-for="sport in sports" :key="sport" :value="sport">{{ sport }}</option>
        </select>
        <select v-model="selectedDay" @change="updateSearch(true)">
          <option value="" disabled>Day</option>
          <option value="today">Today</option>
          <option value="next5days">1-5 days</option>
          <option value="fromDay5to10">5-10 days</option>
          <option value="afterDay10">10+ days</option>
        </select>
        <button @click="resetFilters" class="reset-btn">Reset Filters</button>
      </div>
    </section>
    <section class="events-section">
      <h2 class="section-title">Results</h2>
      <div class="events-list-container">
        <EventList v-if="events.length" :events="events" />
        <p v-else class="no-results">No results</p>
        <div class="pagination-controls" v-if="events.length">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPageCount">Next</button>
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
.events-container {
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.section-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 20px;
}

.search-section {
  background-color: #f8f9fa;
  padding: 20px 5%;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 70px;
}

.events-section {
  background-color: #f8f9fa;
  padding: 20px 5%;
  border-bottom: 1px solid #e0e0e0;
  margin-top: 20px;
}

.search-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.search-section input, .search-section select {
  flex: 1;
  max-width: calc(25% - 10px);
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.events-list-container {
  margin-top: 20px;
}

.reset-btn {
  flex: 1;
  max-width: calc(25% - 10px);
  padding: 8px;
  margin-bottom: 15px;
  background-color: #ff7f7f;
  border: 1px solid #ff4f4f;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-align: center;
  font-size: 0.9rem;
  color: white;
}

.reset-btn:hover {
  background-color: #ff4f4f;
}
</style>
