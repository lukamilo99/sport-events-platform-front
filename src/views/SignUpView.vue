<template>
  <div class="register container">
    <h2>Register</h2>
    <input v-model="firstname" type="text" placeholder="First Name">
    <input v-model="lastname" type="text" placeholder="Last Name">
    <input v-model="email" type="email" placeholder="Email">
    <input v-model="password" type="password" placeholder="Password">
    <input v-model="repeatedPassword" type="password" placeholder="Confirm Password">
    <button @click="register" class="register-btn">Register</button>
    <button @click="googleRegister" class="google-register-btn">
      <img src="google.png" alt="Google" class="google-icon"> Google
    </button>
    <p>Already have an account? <router-link to="/login">Login</router-link></p>
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
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.register-btn, .google-register-btn {
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

.register-btn:hover {
  background-color: #217c3b;
}

.google-register-btn {
  background-color: #dc3545;
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

p {
  text-align: center;
}

.notification-component-class {

}
</style>
