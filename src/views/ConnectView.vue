<template>
  <div class="container rounded shadow">
    <h1 class="mb-4">Connect with Users</h1>
    <input v-model="searchQuery" placeholder="Search by user name" @input="updateSearch(true)" class="form-control mb-4" />

    <ul v-if="users" class="list-group">
      <li v-for="user in users" :key="user.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span class="user-name">{{ user.name }}</span>
        <div>
          <button v-if="user.relation.status === 'NO_REQUEST'" @click="sendFriendRequest(user.id)" class="btn btn-success btn-sm mr-2">Add Friend</button>
          <div v-else-if="user.relation.status === 'PENDING' && user.relation.senderId === user.id">
            <button @click="acceptRequest(user.relation.requestId)" class="btn btn-success btn-sm mr-2">Accept</button>
            <button @click="declineRequest(user.relation.requestId)" class="btn btn-danger btn-sm mr-2">Reject</button>
          </div>
          <button v-else-if="user.relation.status === 'PENDING' && user.relation.recipientId === user.id" @click="cancelFriendRequest(user.relation.requestId)" class="btn btn-warning btn-sm mr-2">Cancel Request</button>
          <button v-else-if="user.relation.status === 'ACCEPTED'" @click="deleteFriend(user.relation.friendshipId)" class="btn btn-secondary btn-sm">Delete Friend</button>
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
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from "vue-router";

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
    const response = await axios.get(`http://localhost:8081/user/public/search-users`, {
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
};

const sendFriendRequest = async (userId) => {
  try {
    await axios.post(`http://localhost:8081/interaction/friend-request/${userId}`);
    await fetchUsers(route.query);
  } catch (error) {
    console.error('Failed to send friend request:', error);
  }
};

const cancelFriendRequest = async (requestId) => {
  try {
    await axios.delete(`http://localhost:8081/interaction/request/${requestId}/cancel`);
    await fetchUsers(route.query);
  } catch (error) {
    console.error('Failed to cancel friend request:', error);
  }
};

const acceptRequest = async (requestId) => {
  try {
    await axios.post(`http://localhost:8081/interaction/request/${requestId}/accept`);
    await fetchUsers(route.query);
  } catch (error) {
    console.error('Failed to accept request:', error);
  }
};

const declineRequest = async (requestId) => {
  try {
    await axios.post(`http://localhost:8081/interaction/request/${requestId}/decline`);
    await fetchUsers(route.query);
  } catch (error) {
    console.error('Failed to decline request:', error);
  }
};

const deleteFriend = async (friendshipId) => {
  try {
    await axios.delete(`http://localhost:8081/friends/delete/${friendshipId}`);
    await fetchUsers(route.query);
  } catch (error) {
    console.error('Failed to delete friend:', error);
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
    path: `/connect`,
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
.container {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
  padding: 2rem 2rem;
}

.no-results {
  text-align: center;
  color: #999;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
