<template>
  <div class="container">
    <h2>Profile</h2>
    <div>
      <label for="firstname">First Name:</label>
      <input v-model="firstname" type="text" id="firstname">
    </div>
    <div>
      <label for="lastname">Last Name:</label>
      <input v-model="lastname" type="text" id="lastname">
    </div>
    <div>
      <label for="email">Email:</label>
      <input v-model="email" type="email" id="email" :disabled="isOAuthUser">
    </div>
    <button @click="updateProfile">Update Profile</button>
    <NotificationComponent/>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useValidator } from '@/validator/validator';
import NotificationComponent from "@/components/NotificationComponent.vue";

export default {
  components: {
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
.container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

button {
  width: 80%;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 25px;
  background-color: #007BFF;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 10px auto;
  display: block;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}
</style>

