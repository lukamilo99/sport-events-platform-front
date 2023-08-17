<template>
  <div class="login container shadow">
    <h2 class="mb-4">Login</h2>
    <div class="mb-3">
      <input v-model="email" type="email" placeholder="Email" class="form-control">
    </div>
    <div class="mb-3">
      <input v-model="password" type="password" placeholder="Password" class="form-control">
    </div>
    <button @click="login" class="login-btn btn btn-success btn-block mb-2">Login</button>
    <button @click="googleLogin" class="google-login-btn btn btn-danger btn-block d-flex align-items-center justify-content-center mb-3">
      <img src="~@/assets/google.png" alt="Google" class="google-icon mr-2"> Google
    </button>
    <p class="text-center">Don't have an account? <router-link to="/register">Register</router-link></p>
    <NotificationComponent/>
  </div>
</template>

<script>
import { ref } from 'vue';
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

    const email = ref('');
    const password = ref('');

    const validateLogin = () => {
      const emailError = validateEmail(email.value);
      if (emailError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: emailError
        });
        return false;
      }

      const passwordError = validateNotEmpty(password.value);
      if (passwordError) {
        store.dispatch('addNotification', {
          type: 'error',
          message: passwordError
        });
        return false;
      }
      return true;
    };

    const login = async () => {
      if (!validateLogin()) return;
      try {
        await store.dispatch('login', { email: email.value, password: password.value });
        await store.dispatch('fetchUserAndRedirect');
      } catch (error) {
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Login failed. Please try again.'
        });
        console.error(error);
      }
    };

    const googleLogin = async () => {
      try {
        await store.dispatch('googleLogin');
      } catch (error) {
        await store.dispatch('addNotification', {
          type: 'error',
          message: 'Google login failed. Please try again.'
        });
        console.error(error);
      }
    };

    return {
      email,
      password,
      login,
      googleLogin
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

.login-btn, .google-login-btn {
  width: 200px;
  height: 40px;
}

.login-btn:hover, .google-login-btn:hover {
  transform: scale(1.02);
}

.google-icon {
  height: 20px;
}
</style>


