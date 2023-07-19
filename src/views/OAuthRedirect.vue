<script>
import { useStore } from 'vuex';

export default {
  name: 'OAuthRedirect',
  setup() {
    const store = useStore();
    store.dispatch('fetchUserAndRedirect');
    return {};
  }
};
</script>
