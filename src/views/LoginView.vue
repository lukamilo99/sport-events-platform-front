<template>
  <div class="login container">
    <h2>Login</h2>
    <input v-model="email" type="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Password">
    <button @click="login" class="login-btn">Login</button>
    <button @click="googleLogin" class="google-login-btn">
      <img src="google.png" alt="Google" class="google-icon"> Google
    </button>
    <p>Don't have an account? <router-link to="/register">Register</router-link></p>
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
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.login-btn, .google-login-btn {
  background-color: #28a745;
  color: #fff;
  display: block;
  width: 80%;
  margin: 10px auto;
  padding: 0.4rem 0.8rem;
  border-radius: 25px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.login-btn:hover {
  background-color: #217c3b;
}

.google-login-btn {
  background-color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-login-btn:hover {
  background-color: #b22234;
}

p {
  text-align: center;
}
</style>

