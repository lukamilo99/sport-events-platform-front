<template>
  <div class="users-container container bg-white p-4 rounded shadow-sm">
    <h1 class="mb-4">Users List</h1>
    <input v-model="searchQuery" placeholder="Search by user name" @input="updateSearch(true)" class="form-control mb-4" />

    <ul v-if="users" class="list-group">
      <li v-for="user in users" :key="user.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span class="user-name">{{ user.firstname }} {{ user.lastname }}</span>
        <div>
          <button v-if="user.enabled" @click="banUser(user.id)" class="btn btn-warning btn-sm mr-2">Ban</button>
          <button v-else @click="unbanUser(user.id)" class="btn btn-info btn-sm mr-2">Unban</button>
          <button @click="deleteUser(user.id)" class="btn btn-danger btn-sm">Delete</button>
        </div>
      </li>
    </ul>

    <p v-else class="no-results mt-4 text-center">No results</p>

    <div class="pagination-controls mt-4 d-flex justify-content-between align-items-center" v-if="users.length">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-primary">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPageCount" class="btn btn-primary">Next</button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch} from 'vue';
import axios from 'axios';
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const users = ref([]);
const currentPage = ref(1);
const totalPageCount = ref(0);
const searchQuery = ref("");

onMounted(() => {
  fetchUsers(route.query);
});

watch(() => route.query, newQuery => {
  fetchUsers(newQuery);
});

const fetchUsers = async (query = {}) => {
  try {
    const response = await axios.get(`http://localhost:8081/user/search-users`, {
      params: {
        ...query,
        page: currentPage.value - 1
      }
    });
    users.value = response.data.users;
    totalPageCount.value = Math.ceil(response.data.totalCount / 6);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

const banUser = async (userId) => {
  try {
    await axios.put(`http://localhost:8081/user/ban/${userId}`);
    await fetchUsers(route.query)
  } catch (error) {
    console.error('Failed to ban user:', error);
  }
};

const unbanUser = async (userId) => {
  try {
    await axios.put(`http://localhost:8081/user/unban/${userId}`);
    await fetchUsers(route.query)
  } catch (error) {
    console.error('Failed to unban user:', error);
  }
};

const deleteUser = async (userId) => {
  try {
    await axios.delete(`http://localhost:8081/user/delete/${userId}`);
    await fetchUsers(route.query);

    if (!users.value.length && currentPage.value > 1) {
      currentPage.value--;
      updateSearch();
    }

  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

const updateSearch = (resetPage = false) => {
  let queryParams = {};

  if (searchQuery.value) {
    queryParams.name = searchQuery.value;
  }

  if (resetPage) {
    currentPage.value = 1;
  }

  router.push({
    path: `/users`,
    query: { ...queryParams, page: currentPage.value }
  });
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

</script>

<style scoped>
.users-container {
  max-width: 600px;
  margin: 100px auto;
  box-sizing: border-box;
}

.no-results {
  color: #777;
}
</style>

