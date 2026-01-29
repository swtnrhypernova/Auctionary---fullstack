<template>
  <div class="min-h-screen bg-white text-zinc-900">
    <Navbar :isLoggedIn="isLoggedIn" @logout="logout" />

    <main class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <transition name="page" mode="out-in">
        <router-view :key="$route.fullPath" :isLoggedIn="isLoggedIn" />
      </transition>
    </main>

    <div class="h-12"></div>
  </div>
</template>

<script>
import Navbar from "@/views/components/Navbar.vue";
import { userService } from "@/services/user.service";
import { authStore } from "@/services/auth.store";

export default {
  name: "App",
  components: { Navbar },

  data() {
    return {
      isLoggedIn: !!authStore.getToken(),
    };
  },

  async mounted() {
    await this.validateSession();
  },

  methods: {
    refreshAuth() {
      this.isLoggedIn = !!authStore.getToken();
    },

    async validateSession() {
      const token = authStore.getToken();
      const userId = authStore.getUserId();

      // No stored session
      if (!token || !userId) {
        this.isLoggedIn = false;
        return;
      }

      // Token exists -> confirm backend still accepts it
      try {
        await userService.getUserDetails(userId);
        this.isLoggedIn = true;
      } catch (e) {
        // Common after wipe: local token exists but backend doesn't recognise it
        authStore.clearSession();
        this.isLoggedIn = false;

        // If they're not already on login, take them there
        if (this.$route.path !== "/login") {
          this.$router.push("/login");
        }
      }
    },

    logout() {
      userService.logout().finally(() => {
        authStore.clearSession();
        this.refreshAuth();
        this.$router.push("/login");
      });
    },
  },

  watch: {
    $route() {
      this.refreshAuth();
    },
  },
};
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
