<template>
  <div class="py-10 sm:py-14">
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-[13px] font-medium text-zinc-500">Account</p>
        <h1
          class="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900"
        >
          Profile
        </h1>
        <p
          class="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600"
        >
          View activity, listings, and auctions you’re bidding on.
        </p>
      </div>

      <button
        v-if="isMyProfile"
        type="button"
        class="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
        @click="logout"
      >
        Logout
      </button>
    </div>

    <div v-if="loading" class="mt-6 text-sm text-zinc-600">
      Loading profile…
    </div>

    <div
      v-if="!loading && error"
      class="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div v-if="!loading && user" class="mt-6 space-y-6">
      <div
        class="rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <p class="text-[13px] font-medium text-zinc-500">
              {{ isMyProfile ? "Your account" : "User" }}
            </p>
            <h2
              class="mt-1 text-2xl font-semibold tracking-tight text-zinc-900"
            >
              {{ user.first_name }} {{ user.last_name }}
            </h2>
          </div>

          <div class="flex flex-wrap gap-2">
            <span
              class="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] text-zinc-700"
            >
              Selling:
              <span class="font-medium text-zinc-900">{{
                user.selling.length
              }}</span>
            </span>
            <span
              class="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] text-zinc-700"
            >
              Bidding:
              <span class="font-medium text-zinc-900">{{
                user.bidding_on.length
              }}</span>
            </span>
            <span
              class="rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] text-zinc-700"
            >
              Ended:
              <span class="font-medium text-zinc-900">{{
                user.auctions_ended.length
              }}</span>
            </span>
          </div>
        </div>
      </div>

      <section class="space-y-3">
        <div class="flex items-end justify-between">
          <h3 class="text-lg font-semibold text-zinc-900">Selling</h3>
          <router-link
            v-if="isMyProfile"
            to="/item/create"
            class="text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition"
          >
            Create item →
          </router-link>
        </div>

        <div
          v-if="user.selling.length === 0"
          class="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm"
        >
          <h4 class="text-[15px] font-semibold text-zinc-900">
            No items for sale
          </h4>
          <p class="mt-2 text-sm text-zinc-600">
            {{
              isMyProfile
                ? "Create a listing to start selling."
                : "This user isn’t selling anything right now."
            }}
          </p>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <router-link
            v-for="item in user.selling"
            :key="item.item_id"
            :to="'/item/' + item.item_id"
            class="group block rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="flex items-start justify-between gap-3">
              <h4 class="text-[15px] font-semibold leading-snug text-zinc-900">
                {{ item.name }}
              </h4>
              <span
                class="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600"
              >
                #{{ item.item_id }}
              </span>
            </div>
            <p class="mt-3 text-sm text-zinc-600">View item →</p>
          </router-link>
        </div>
      </section>

      <section class="space-y-3">
        <h3 class="text-lg font-semibold text-zinc-900">Bidding on</h3>

        <div
          v-if="user.bidding_on.length === 0"
          class="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm"
        >
          <h4 class="text-[15px] font-semibold text-zinc-900">
            No active bids
          </h4>
          <p class="mt-2 text-sm text-zinc-600">
            {{
              isMyProfile
                ? "Browse items and place a bid to see them here."
                : "This user isn’t bidding right now."
            }}
          </p>

          <router-link
            v-if="isMyProfile"
            to="/search"
            class="mt-4 inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
          >
            Browse items
          </router-link>
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <router-link
            v-for="item in user.bidding_on"
            :key="item.item_id"
            :to="'/item/' + item.item_id"
            class="group block rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="flex items-start justify-between gap-3">
              <h4 class="text-[15px] font-semibold leading-snug text-zinc-900">
                {{ item.name }}
              </h4>
              <span
                class="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600"
              >
                #{{ item.item_id }}
              </span>
            </div>
            <p class="mt-3 text-sm text-zinc-600">View item →</p>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { userService } from "@/services/user.service";
import { authStore } from "@/services/auth.store";

const normaliseArray = (v) => (Array.isArray(v) ? v : []);

export default {
  name: "Profile",
  data() {
    return {
      user: null,
      loading: true,
      error: "",
    };
  },
  computed: {
    myUserId() {
      return authStore.getUserId();
    },
    profileUserId() {
      return Number(this.$route.params.user_id);
    },
    isMyProfile() {
      return Number(this.myUserId) === Number(this.profileUserId);
    },
  },
  mounted() {
    this.fetchProfile();
  },
  watch: {
    "$route.params.user_id"() {
      this.fetchProfile();
    },
  },
  methods: {
    async fetchProfile() {
      this.loading = true;
      this.error = "";
      this.user = null;

      try {
        const user = await userService.getUserDetails(this.profileUserId);

        this.user = {
          ...user,
          selling: normaliseArray(user?.selling),
          bidding_on: normaliseArray(user?.bidding_on),
          auctions_ended: normaliseArray(user?.auctions_ended),
        };
      } catch (err) {
        this.error = err || "Something went wrong";
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.error = "";
      try {
        await userService.logout();
      } catch (err) {
        // Even if logout fails, still clear local session for UX
        this.error = err || "Something went wrong";
      } finally {
        authStore.clearSession();
        this.$router.push("/login");
      }
    },
  },
};
</script>
