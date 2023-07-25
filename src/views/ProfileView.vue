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
    <p class="error-text">{{ updateError }}</p>
  </div>
</template>

<script>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { useValidator } from '@/validator/validator';

export default {
  setup() {
    const store = useStore();
    const { validateEmail, validateNotEmpty } = useValidator();

    const user = computed(() => store.state.user);

    const firstname = ref(user.value.firstname);
    const lastname = ref(user.value.lastname);
    const email = ref(user.value.email);
    const updateError = ref('');
    const isOAuthUser = computed(() => user.value.oauth);

    watch(user, (newVal) => {
      firstname.value = newVal.firstname;
      lastname.value = newVal.lastname;
      email.value = newVal.email;
    });

    const validateUpdate = () => {
      const firstnameError = validateNotEmpty(firstname.value, "Firstname");
      if (firstnameError) {
        updateError.value = firstnameError;
        return false;
      }

      const lastnameError = validateNotEmpty(lastname.value, "Lastname");
      if (lastnameError) {
        updateError.value = lastnameError;
        return false;
      }

      const emailError = validateEmail(email.value);
      if (emailError) {
        updateError.value = emailError;
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
      } catch (e) {
        console.log("Update error:", e);
      }
    };

    return {
      user,
      firstname,
      lastname,
      email,
      updateError,
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

h2 {
  text-align: center;
  margin-bottom: 20px;
}

div {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

