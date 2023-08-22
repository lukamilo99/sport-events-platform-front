<template>
  <div class="container shadow shadow">
    <h2 class="mb-4">Register</h2>
    <div class="mb-3">
      <input v-model="firstname" type="text" placeholder="First Name" class="form-control">
    </div>
    <div class="mb-3">
      <input v-model="lastname" type="text" placeholder="Last Name" class="form-control">
    </div>
    <div class="mb-3">
      <input v-model="email" type="email" placeholder="Email" class="form-control">
    </div>
    <div class="mb-3">
      <input v-model="password" type="password" placeholder="Password" class="form-control">
    </div>
    <div class="mb-3">
      <input v-model="repeatedPassword" type="password" placeholder="Confirm Password" class="form-control">
    </div>
    <button @click="register" class="register-btn btn btn-success btn-block mb-2">Register</button>
    <button @click="googleRegister" class="google-register-btn btn btn-danger btn-block d-flex align-items-center justify-content-center mb-3">
      <img src="~@/assets/google.png" alt="Google" class="google-icon mr-2"> Google
    </button>
    <p class="text-center">Already have an account? <router-link to="/login">Login</router-link></p>
    <NotificationComponent class="notification-component-class"/>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useValidator } from '@/validator/validator';
import NotificationComponent from "@/components/NotificationComponent.vue";

export default {
  components: {NotificationComponent},
  setup() {
    const store = useStore();
    const router = useRouter();
    const { validateEmail, validatePassword, validateNotEmpty, confirmPassword } = useValidator();

    const firstname = ref('');
    const lastname = ref('');
    const email = ref('');
    const password = ref('');
    const repeatedPassword = ref('');

    const validateSignUp = () => {
      const firstnameError = validateNotEmpty(firstname.value, "Firstname");
      if (firstnameError) {
        store.dispatch('addNotification', { message: firstnameError, type: 'error' });
        return false;
      }

      const lastnameError = validateNotEmpty(lastname.value, "Lastname");
      if (lastnameError) {
        store.dispatch('addNotification', { message: lastnameError, type: 'error' });
        return false;
      }

      const emailError = validateEmail(email.value);
      if (emailError) {
        store.dispatch('addNotification', { message: emailError, type: 'error' });
        return false;
      }

      const passwordError = validatePassword(password.value);
      if (passwordError) {
        store.dispatch('addNotification', { message: passwordError, type: 'error' });
        return false;
      }

      const confirmError = confirmPassword(password.value, repeatedPassword.value);
      if (confirmError) {
        store.dispatch('addNotification', { message: confirmError, type: 'error' });
        return false;
      }

      return true;
    };

    const register = async () => {
      if (!validateSignUp()) return;

      try {
        await store.dispatch('register', {
          firstname: firstname.value,
          lastname: lastname.value,
          email: email.value,
          password: password.value,
          repeatedPassword: repeatedPassword.value
        });
        await router.push('/login');
      } catch (error) {
        await store.dispatch('addNotification', {message: 'Error during registration.', type: 'error'});
        console.error(error);
      }
    };

    const googleRegister = async () => {
      try {
        await store.dispatch('googleLogin');
        await router.push('/login');
      } catch (error) {
        await store.dispatch('addNotification', {message: 'Error during Google registration.', type: 'error'});
        console.error(error);
      }
    };

    return {
      firstname,
      lastname,
      email,
      password,
      repeatedPassword,
      register,
      googleRegister
    };
  },
};
</script>

<style scoped>
.container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 400px;
  box-sizing: border-box;
  padding-top: 20px;
  padding-bottom: 20px;
}

.register-btn, .google-register-btn {
  width: 200px;
  height: 40px;
}

.register-btn:hover, .google-register-btn:hover {
  transform: scale(1.02);
}

.google-icon {
  height: 20px;
}
</style>

