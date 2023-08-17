<template>
  <footer class="footer bg-dark text-white py-3">
    <div class="container d-flex justify-content-between align-items-center">
      <div>
        <p class="mb-0">&copy; 2023 Sport Connecting People. All Rights Reserved.</p>
      </div>
      <div>
        <a href="/privacy-policy" class="text-white text-decoration-none px-2">Privacy Policy</a>
        <span>|</span>
        <a href="/terms-of-service" class="text-white text-decoration-none px-2">Terms of Service</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  setup() {

    return {};
  }
};
</script>

<style scoped>
.footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer a:hover {
  text-decoration: underline;
}
</style>
