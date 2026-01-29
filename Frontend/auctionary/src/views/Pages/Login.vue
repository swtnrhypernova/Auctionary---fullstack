<template>
  <div class="py-10 sm:py-14">
    <div class="mx-auto max-w-md">
      <div class="text-center">
        <p class="text-[13px] font-medium text-zinc-500">Welcome back</p>
        <h1
          class="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900"
        >
          Log in
        </h1>
        <p class="mt-2 text-sm text-zinc-600">
          Enter your details to continue.
        </p>
      </div>

      <div
        class="mt-6 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm"
      >
        <form @submit.prevent="submitLogin" class="space-y-4">
          <div>
            <label class="block text-[13px] font-medium text-zinc-700"
              >Email</label
            >
            <input
              type="email"
              placeholder="you@example.com"
              v-model="email"
              @blur="touched.email = true"
              class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            />

            <p
              v-if="shouldShow('email') && email.trim() === ''"
              class="mt-2 text-sm text-red-600"
            >
              Email is required.
            </p>
            <p
              v-else-if="shouldShow('email') && !validEmail"
              class="mt-2 text-sm text-red-600"
            >
              Please enter a valid email address.
            </p>
          </div>

          <div>
            <label class="block text-[13px] font-medium text-zinc-700"
              >Password</label
            >
            <input
              type="password"
              placeholder="••••••••"
              v-model="password"
              @blur="touched.password = true"
              class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            />

            <p
              v-if="shouldShow('password') && password === ''"
              class="mt-2 text-sm text-red-600"
            >
              Password is required.
            </p>
          </div>

          <p
            v-if="error"
            class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {{ error }}
          </p>

          <button
            type="submit"
            class="w-full inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-zinc-900/20 disabled:opacity-60"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Logging in..." : "Login" }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-zinc-600">
            Don’t have an account?
            <router-link
              to="/register"
              class="font-medium text-zinc-900 hover:underline"
            >
              Register
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/user.service";
import { authStore } from "@/services/auth.store";
import { isEmail } from "@/utils/validators";

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      isSubmitting: false,
      error: "",
      touched: {
        email: false,
        password: false,
      },
    };
  },
  computed: {
    validEmail() {
      return isEmail(this.email);
    },
  },
  methods: {
    shouldShow(field) {
      return this.submitted || this.touched[field];
    },

    async submitLogin() {
      this.submitted = true;
      this.error = "";

      if (this.email.trim() === "" || this.password === "") return;
      if (!this.validEmail) return;

      this.isSubmitting = true;
      try {
        const data = await userService.login(this.email.trim(), this.password);
        authStore.setUserId(data.user_id);
        authStore.setToken(data.session_token);

        // If router redirected them to login, go back to intended page
        const redirectTo = this.$route.query.redirect;
        this.$router.push(redirectTo || "/");
      } catch (err) {
        this.error = err;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
