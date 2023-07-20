<template>
  <div class="login container">
    <h2>Login</h2>
    <input v-model="email" type="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Password">
    <button @click="login" class="login-btn">Login</button>
    <button @click="googleLogin" class="google-login-btn">
      <img src="src/assets/google.png" alt="Google" class="google-icon"> Login using Google account
    </button>
    <p>Don't have an account? <router-link to="/register">Register</router-link></p>
    <p class="error-text">{{ loginError }}</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { useValidator } from '@/validator/validator';

export default {

  setup() {
    const store = useStore();
    const { validateEmail, validateNotEmpty } = useValidator();

    const email = ref('');
    const password = ref('');
    const loginError = ref('');
    const user = computed(() => store.state.user);
    const isLoggedIn = computed(() => store.state.isLoggedIn);

    const validateLogin = () => {
      loginError.value = '';

      const emailError = validateEmail(email.value);
      if (emailError) {
        loginError.value = emailError;
        return false;
      }

      const passwordError = validateNotEmpty(password.value);
      if (passwordError) {
        loginError.value = passwordError;
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
        console.error(error);
      }
    };

    const googleLogin = async () => {
      try {
        await store.dispatch('googleLogin');
      } catch (error) {
        console.error(error);
      }
    };

    return {
      email,
      password,
      user,
      isLoggedIn,
      loginError,
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

h2 {
  margin-bottom: 20px;
  text-align: center;
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
  background-color: #28a745;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 10px auto;
  display: block;
}

button:hover {
  transform: scale(1.05);
  background-color: #217c3b;
}

.google-login-btn {
  background-color: #dc3545;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-login-btn:hover {
  background-color: #b22234;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  vertical-align: middle;
}

p {
  text-align: center;
}

.error-text {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: center;
}
</style>

