<template>
  <div class="users-container">
    <h1>Users List</h1>
    <input v-model="searchQuery" placeholder="Search by event name" @input="updateSearch(true)" />
    <ul v-if="users" class="users-list">
      <li v-for="user in users" :key="user.id" class="user-item">
        <span class="user-name">{{ user.firstname }} {{ user.lastname }}</span>
        <button v-if="user.enabled" @click="banUser(user.id)">Ban</button>
        <button v-else @click="unbanUser(user.id)">Unban</button>
        <button @click="deleteUser(user.id)">Delete</button>
      </li>
    </ul>
    <p v-else class="no-results">No results</p>
    <div class="pagination-controls" v-if="users.length">
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPageCount">Next</button>
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
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.users-list {
  list-style-type: none;
  padding: 0;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 5px;
  margin-bottom: 0.5rem;
}

.user-name {
  flex: 1;
  padding-right: 1rem;
}

button {
  padding: 0.5rem 1rem;
  margin-left: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #e0e0e0;
}
</style>
