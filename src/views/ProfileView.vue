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
  </div>
</template>



<script>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const user = computed(() => store.state.user);

    const firstname = ref(user.value.firstname);
    const lastname = ref(user.value.lastname);
    const email = ref(user.value.email);
    const error = ref('');
    const isOAuthUser = computed(() => user.value.isOAuth);

    watch(user, (newVal) => {
      firstname.value = newVal.firstname;
      lastname.value = newVal.lastname;
      email.value = newVal.email;
    });

    const validateFields = () => {
      if (!firstname.value.trim()) {
        return "First name cannot be empty.";
      }
      if (!lastname.value.trim()) {
        return "Last name cannot be empty.";
      }
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailRegex.test(email.value)) {
        return "Invalid email format.";
      }
      return null;
    };

    const updateProfile = async () => {
      const validationError = validateFields();
      if (validationError) {
        error.value = validationError;
        return;
      }
      try {
        await store.dispatch('updateProfile', {
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value
        });
      } catch (error) {
        console.log("Update error")
      }
    };

    return {
      user,
      firstname,
      lastname,
      email,
      error,
      isOAuthUser,
      updateProfile
    };
  },
};
</script>
