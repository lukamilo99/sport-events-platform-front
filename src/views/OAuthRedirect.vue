<script>
import { useStore } from 'vuex';
import {onMounted, ref} from "vue";

export default {
  setup() {
    const store = useStore();
    const jwt = ref(null)

    onMounted(() => {
      const params = new URLSearchParams(window.location.search);
      jwt.value = params.get('jwt');
      if (jwt.value) {
        localStorage.setItem('jwt', jwt.value);
      }
      store.dispatch('fetchUserAndRedirect');
    });
    return {};
  }
};
</script>
