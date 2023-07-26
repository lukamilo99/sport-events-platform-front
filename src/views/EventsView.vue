<template>
  <div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();
    const events = ref([]);

    onMounted(async () => {
      try {
        const param = route.query.param;
        const response = await axios.get(`http://localhost:8081/event/search`, { params: { query: param } });
        events.value = response.data;
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    });

    return {
      events
    };
  },
};
</script>

