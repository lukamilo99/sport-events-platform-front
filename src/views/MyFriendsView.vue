<template>
  <div class="container shadow">
    <ProfileNavigationComponent />
    <h2 class="my-3">Friends</h2>
    <ul class="list-unstyled">
      <li v-for="friend in friendsList" :key="friend.id" class="py-2 border-bottom">
        <div class="friend-item">
          {{ friend.name }}
          <div class="friend-actions">
            <button @click="removeFriend(friend.id)" class="btn btn-sm btn-danger ml-2">Remove</button>
          </div>
        </div>
      </li>
    </ul>
    <div v-if="friendsList.length" class="d-flex justify-content-between mt-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-primary">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPageCount" class="btn btn-primary">Next</button>
    </div>
    <p v-else class="no-results text-center text-muted my-4">No friends found</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProfileNavigationComponent from "@/components/ProfileNavigationComponent.vue";

export default {
  components: {ProfileNavigationComponent},
  setup() {
    const friendsList = ref([]);
    const currentPage = ref(1);
    const totalPageCount = ref(0);
    const searchQuery = ref('');

    const fetchUserFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/friends/user-friends`, {
          params: {
            page: currentPage.value - 1
          }
        });
        friendsList.value = response.data.users;
        totalPageCount.value = Math.ceil(response.data.totalCount / 6);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    const removeFriend = async (friendId) => {
      try {
        await axios.post(`http://localhost:8081/friends/remove/${friendId}`);
        await fetchUserFriends();
      } catch (error) {
        console.error("Error removing friend:", error);
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPageCount.value) {
        currentPage.value++;
        fetchUserFriends();
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchUserFriends();
      }
    };

    onMounted(() => {
      fetchUserFriends();
    });

    return {
      friendsList,
      removeFriend,
      nextPage,
      prevPage,
      currentPage,
      totalPageCount,
      searchQuery
    };
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

.btn-primary {
  margin-left: 10px;
}

.friend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.friend-actions {
  display: flex;
  align-items: center;
}

.no-results {
  text-align: center;
  color: #999;
  font-size: 1.2rem;
  margin-top: 20px;
}
</style>
