<template>
  <div class="register container">
    <h2>Register</h2>
    <input v-model="firstname" type="text" placeholder="First Name">
    <input v-model="lastname" type="text" placeholder="Last Name">
    <input v-model="email" type="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Password">
    <input v-model="confirmPassword" type="password" placeholder="Confirm Password">
    <button @click="register" class="register-btn">Register</button>
    <button @click="googleRegister" class="google-register-btn">
      <img src="src/assets/google.png" alt="Google" class="google-icon"> Register using Google account
    </button>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
    <p class="error-text">{{ signUpError }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();

    const firstname = ref('');
    const lastname = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const signUpError = ref('');

    const isValidEmail = (input) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailPattern.test(input);
    };

    const isValidPassword = (input) => {
      const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?!.*\s).{8,}$/;
      return passwordPattern.test(input);
    };

    const validateSignUp = () => {
      signUpError.value = '';

      if (firstname.value === '' || lastname.value === '' || email.value === '' ||
          password.value === '' || confirmPassword.value === '') {
        signUpError.value = 'All fields must be filled out.';
        return false;
      }

      if (!isValidEmail(email.value)) {
        signUpError.value = 'Invalid email format.';
        return false;
      }

      if (!isValidPassword(password.value)) {
        signUpError.value = 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and be at least 8 characters long.';
        return false;
      }

      if (password.value !== confirmPassword.value) {
        signUpError.value = 'Passwords do not match.';
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
          confirmPassword: confirmPassword.value
        });
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
    };

    const googleRegister = async () => {
      try {
        await store.dispatch('googleLogin');
        await router.push('/login');
      } catch (error) {
        console.error(error);
      }
    };

    return {
      firstname,
      lastname,
      email,
      password,
      confirmPassword,
      signUpError,
      register,
      googleRegister
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

h1 {
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
  background-color: #007bff;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  margin: 10px auto;
  display: block;
}

button:hover {
  transform: scale(1.05);
  background-color: #0056b3;
}

.google-register-btn {
  background-color: #dc3545;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-register-btn:hover {
  background-color: #b22234;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 5px;
  vertical-align: middle;
}

.error-text {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: center;
}

</style>
