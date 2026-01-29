<template>
  <div class="py-10 sm:py-14">
    <div class="mx-auto max-w-md">
      <div class="text-center">
        <p class="text-[13px] font-medium text-zinc-500">Account</p>
        <h1
          class="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900"
        >
          Create your account
        </h1>
        <p class="mt-2 text-sm text-zinc-600">
          Join to bid, sell, and ask questions.
        </p>
      </div>

      <div
        class="mt-6 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm"
      >
        <form @submit.prevent="submitRegister" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[13px] font-medium text-zinc-700"
                >First name</label
              >
              <input
                v-model="first_name"
                @blur="touched.first_name = true"
                type="text"
                placeholder="First Name"
                class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
              />
              <p
                v-if="shouldShow('first_name') && first_name.trim() === ''"
                class="mt-2 text-sm text-red-600"
              >
                First name is required.
              </p>
            </div>

            <div>
              <label class="block text-[13px] font-medium text-zinc-700"
                >Last name</label
              >
              <input
                v-model="last_name"
                @blur="touched.last_name = true"
                type="text"
                placeholder="Last Name"
                class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
              />
              <p
                v-if="shouldShow('last_name') && last_name.trim() === ''"
                class="mt-2 text-sm text-red-600"
              >
                Last name is required.
              </p>
            </div>
          </div>

          <div>
            <label class="block text-[13px] font-medium text-zinc-700"
              >Email</label
            >
            <input
              v-model="email"
              @blur="touched.email = true"
              type="email"
              placeholder="you@example.com"
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
              v-model="password"
              @blur="touched.password = true"
              type="password"
              placeholder="••••••••"
              class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            />

            <div class="mt-3">
              <div class="flex items-center justify-between">
                <p class="text-[13px] text-zinc-600">Password strength</p>
                <p class="text-[13px] font-medium" :class="strengthTextClass">
                  {{ strengthLabel }}
                </p>
              </div>

              <div
                class="mt-2 h-2 w-full rounded-full bg-zinc-100 overflow-hidden"
              >
                <div
                  class="h-full transition-all"
                  :class="strengthBarClass"
                  :style="{ width: strengthPercent + '%' }"
                ></div>
              </div>

              <ul class="mt-3 space-y-1 text-[13px]">
                <li
                  class="flex items-center gap-2"
                  :class="ruleClass(hasMinLength)"
                >
                  <span>{{ hasMinLength ? "✓" : "•" }}</span>
                  8+ characters
                </li>
                <li
                  class="flex items-center gap-2"
                  :class="ruleClass(hasLetter)"
                >
                  <span>{{ hasLetter ? "✓" : "•" }}</span>
                  Contains a letter
                </li>
                <li
                  class="flex items-center gap-2"
                  :class="ruleClass(hasNumber)"
                >
                  <span>{{ hasNumber ? "✓" : "•" }}</span>
                  Contains a number
                </li>
                <li
                  class="flex items-center gap-2"
                  :class="ruleClass(hasSymbol)"
                >
                  <span>{{ hasSymbol ? "✓" : "•" }}</span>
                  Contains a symbol
                </li>
              </ul>

              <p
                v-if="
                  shouldShow('password') && password !== '' && !validPassword
                "
                class="mt-3 text-sm text-red-600"
              >
                Password must be 8+ characters and include a letter, number, and
                symbol.
              </p>
            </div>
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
            {{ isSubmitting ? "Creating..." : "Register" }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-zinc-600">
            Already have an account?
            <router-link
              to="/login"
              class="font-medium text-zinc-900 hover:underline"
            >
              Log in
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/user.service";
import {
  isEmail,
  hasMinLength,
  hasLetter,
  hasNumber,
  hasSymbol,
  isStrongPassword,
  passwordStrengthScore,
  passwordStrengthLabel,
} from "@/utils/validators";

export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      submitted: false,
      isSubmitting: false,
      error: "",
      touched: {
        first_name: false,
        last_name: false,
        email: false,
        password: false,
      },
    };
  },
  computed: {
    validEmail() {
      return isEmail(this.email);
    },

    hasMinLength() {
      return hasMinLength(this.password);
    },
    hasLetter() {
      return hasLetter(this.password);
    },
    hasNumber() {
      return hasNumber(this.password);
    },
    hasSymbol() {
      return hasSymbol(this.password);
    },
    validPassword() {
      return isStrongPassword(this.password);
    },

    strengthScore() {
      return passwordStrengthScore(this.password);
    },
    strengthLabel() {
      return passwordStrengthLabel(this.password);
    },
    strengthPercent() {
      if (this.password.length === 0) return 0;
      return Math.round((this.strengthScore / 4) * 100);
    },
    strengthTextClass() {
      if (this.password.length === 0) return "text-zinc-500";
      if (this.strengthScore <= 1) return "text-red-600";
      if (this.strengthScore === 2) return "text-amber-600";
      return "text-emerald-600";
    },
    strengthBarClass() {
      if (this.password.length === 0) return "bg-zinc-300";
      if (this.strengthScore <= 1) return "bg-red-500";
      if (this.strengthScore === 2) return "bg-amber-500";
      return "bg-emerald-500";
    },
  },
  methods: {
    shouldShow(field) {
      return this.submitted || this.touched[field];
    },
    ruleClass(passed) {
      return passed ? "text-emerald-700" : "text-zinc-600";
    },

    async submitRegister() {
      this.submitted = true;
      this.error = "";

      const nameOk =
        this.first_name.trim() !== "" && this.last_name.trim() !== "";
      const emailOk = this.email.trim() !== "" && this.validEmail;
      const passOk = this.password !== "" && this.validPassword;

      if (!nameOk || !emailOk || !passOk) return;

      this.isSubmitting = true;
      try {
        await userService.register(
          this.first_name.trim(),
          this.last_name.trim(),
          this.email.trim(),
          this.password
        );
        this.$router.push("/login");
      } catch (err) {
        this.error = err;
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
