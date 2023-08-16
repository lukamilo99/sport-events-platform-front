<template>
  <div class="container profile-container bg-white p-4 rounded shadow-sm">
    <ProfileNavigationComponent />
    <h2 class="my-3">Profile</h2>

    <form @submit.prevent="updateProfile">
      <div class="mb-3">
        <label for="firstname" class="form-label">First Name:</label>
        <input v-model="firstname" type="text" id="firstname" class="form-control">
      </div>

      <div class="mb-3">
        <label for="lastname" class="form-label">Last Name:</label>
        <input v-model="lastname" type="text" id="lastname" class="form-control">
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input v-model="email" type="email" id="email" class="form-control" :disabled="isOAuthUser">
      </div>

      <button type="submit" class="btn btn-primary w-100">Update Profile</button>
    </form>

    <NotificationComponent/>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useValidator } from '@/validator/validator';
import NotificationComponent from "@/components/NotificationComponent.vue";
import ProfileNavigationComponent from "@/components/ProfileNavigationComponent.vue";

export default {
  components: {
    ProfileNavigationComponent,
    NotificationComponent
  },
  setup() {
    const store = useStore();
    const { validateEmail, validateNotEmpty } = useValidator();
    const user = computed(() => store.getters['user']);
    const isOAuthUser = ref(user.value.oauth);
    const firstname = ref(user.value.firstname);
    const lastname = ref(user.value.lastname);
    const email = ref(user.value.email);

    const validateUpdate = () => {
      const firstnameError = validateNotEmpty(firstname.value, "Firstname");
      if (firstnameError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: firstnameError
        });
        return false;
      }

      const lastnameError = validateNotEmpty(lastname.value, "Lastname");
      if (lastnameError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: lastnameError
        });
        return false;
      }

      const emailError = validateEmail(email.value);
      if (emailError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: emailError
        });
        return false;
      }
      return true;
    };

    const updateProfile = async () => {
      if (!validateUpdate()) return;

      try {
        await store.dispatch('updateProfile', {
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value
        });
        await store.dispatch('addNotification', {
          type: 'success',
          message: 'Profile updated successfully!'
        });
      } catch (e) {
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Failed to update profile.'
        });
        console.log("Update error:", e);
      }
    };

    return {
      user,
      firstname,
      lastname,
      email,
      isOAuthUser,
      updateProfile
    };
  },
};
</script>

<style scoped>
.profile-container {
  margin-left: auto;
  margin-right: auto;
  max-width: 800px;
}
</style>

