<template>
  <header
    class="sticky top-0 z-50 border-b border-black/5 bg-white/70 backdrop-blur-xl"
  >
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <!-- Left: Brand -->
        <router-link
          to="/"
          class="inline-flex items-center gap-2 font-semibold tracking-tight text-zinc-900"
        >
          <span
            class="grid h-8 w-8 place-items-center rounded-xl border border-black/5 bg-white shadow-sm"
            aria-hidden="true"
          >
            <span class="h-3 w-3 rounded-full bg-zinc-900"></span>
          </span>
          <span class="text-[15px]">Auctionary</span>
        </router-link>

        <!-- Center: Desktop links -->
        <nav
          class="hidden md:flex items-center gap-6 text-[13px] font-medium text-zinc-600"
        >
          <router-link
            to="/"
            class="transition hover:text-zinc-900"
            :class="linkClass('/')"
          >
            Home
          </router-link>

          <router-link
            to="/search"
            class="transition hover:text-zinc-900"
            :class="linkClass('/search')"
          >
            Search
          </router-link>

          <router-link
            v-if="isLoggedIn"
            to="/item/create"
            class="transition hover:text-zinc-900"
            :class="linkClass('/item/create')"
          >
            Sell
          </router-link>

          <router-link
            v-if="isLoggedIn"
            to="/drafts"
            class="transition hover:text-zinc-900"
            :class="linkClass('/drafts')"
          >
            Drafts
          </router-link>
        </nav>

        <!-- Right: Actions -->
        <div class="hidden md:flex items-center gap-3">
          <template v-if="!isLoggedIn">
            <router-link
              to="/login"
              class="rounded-full px-4 py-2 text-[13px] font-medium text-zinc-700 transition hover:bg-black/5"
              :class="linkPillClass('/login')"
            >
              Login
            </router-link>

            <router-link
              to="/register"
              class="rounded-full bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-zinc-900/30"
              :class="linkPillClass('/register')"
            >
              Register
            </router-link>
          </template>

          <template v-else>
            <router-link
              :to="`/profile/${userId}`"
              class="rounded-full px-4 py-2 text-[13px] font-medium text-zinc-700 transition hover:bg-black/5"
              :class="linkPillClass(`/profile/${userId}`)"
            >
              Profile
            </router-link>

            <button
              type="button"
              class="rounded-full px-4 py-2 text-[13px] font-medium text-zinc-700 transition hover:bg-black/5"
              @click="$emit('logout')"
            >
              Logout
            </button>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button
          type="button"
          class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/5 bg-white text-zinc-900 shadow-sm transition hover:bg-black/5"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!mobileOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <!-- Mobile dropdown -->
      <div v-if="mobileOpen" class="md:hidden pb-4">
        <div class="mt-2 rounded-2xl border border-black/5 bg-white shadow-sm">
          <div class="p-2 text-[13px] font-medium text-zinc-700">
            <router-link
              to="/"
              class="block rounded-xl px-3 py-2 transition hover:bg-black/5"
              @click="mobileOpen = false"
            >
              Home
            </router-link>

            <router-link
              to="/search"
              class="block rounded-xl px-3 py-2 transition hover:bg-black/5"
              @click="mobileOpen = false"
            >
              Search
            </router-link>

            <router-link
              v-if="isLoggedIn"
              to="/item/create"
              class="block rounded-xl px-3 py-2 transition hover:bg-black/5"
              @click="mobileOpen = false"
            >
              Sell
            </router-link>

            <router-link
              v-if="isLoggedIn"
              to="/drafts"
              class="block rounded-xl px-3 py-2 transition hover:bg-black/5"
              @click="mobileOpen = false"
            >
              Drafts
            </router-link>

            <div class="my-2 h-px bg-black/5"></div>

            <template v-if="!isLoggedIn">
              <router-link
                to="/login"
                class="block rounded-xl px-3 py-2 transition hover:bg-black/5"
                @click="mobileOpen = false"
              >
                Login
              </router-link>

              <router-link
                to="/register"
                class="block rounded-xl bg-zinc-900 px-3 py-2 text-white transition hover:opacity-90"
                @click="mobileOpen = false"
              >
                Register
              </router-link>
            </template>

            <template v-else>
              <router-link
                :to="`/profile/${userId}`"
                class="block rounded-xl px-3 py-2 transition hover:bg-black/5"
                @click="mobileOpen = false"
              >
                Profile
              </router-link>

              <button
                type="button"
                class="block w-full text-left rounded-xl px-3 py-2 transition hover:bg-black/5"
                @click="
                  $emit('logout');
                  mobileOpen = false;
                "
              >
                Logout
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { authStore } from "@/services/auth.store";

export default {
  props: {
    isLoggedIn: { type: Boolean, required: true },
  },
  data() {
    return { mobileOpen: false };
  },
  computed: {
    userId() {
      return authStore.getUserId();
    },
  },
  methods: {
    linkClass(path) {
      return this.$route.path === path ? "text-zinc-900" : "";
    },
    linkPillClass(path) {
      return this.$route.path === path ? "ring-2 ring-zinc-900/10" : "";
    },
  },
  watch: {
    $route() {
      this.mobileOpen = false;
    },
  },
};
</script>
