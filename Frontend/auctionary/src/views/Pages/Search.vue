<template>
  <div class="py-10 sm:py-14">
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-[13px] font-medium text-zinc-500">Browse</p>
        <h1
          class="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900"
        >
          Search auctions
        </h1>
        <p
          class="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600"
        >
          Find items, filter by category, and switch views for listings, bids,
          or ended auctions.
        </p>
      </div>
    </div>

    <div class="mt-6 rounded-3xl border border-black/5 bg-white shadow-sm">
      <div class="p-4 sm:p-6">
        <Searchbar
          :categories="categories"
          v-model="searchQuery"
          :selectedCategoryIds="selectedCategoryIds"
          @update:selectedCategoryIds="selectedCategoryIds = $event"
          @search="fetchItems"
        />

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-full px-4 py-2 text-[13px] font-medium transition"
            :class="status === '' ? activeSeg : inactiveSeg"
            @click="setStatus('')"
          >
            All
          </button>

          <button
            type="button"
            class="rounded-full px-4 py-2 text-[13px] font-medium transition"
            :class="status === 'OPEN' ? activeSeg : inactiveSeg"
            @click="setStatus('OPEN')"
          >
            My listings
          </button>

          <button
            type="button"
            class="rounded-full px-4 py-2 text-[13px] font-medium transition"
            :class="status === 'BID' ? activeSeg : inactiveSeg"
            @click="setStatus('BID')"
          >
            My bids
          </button>

          <button
            type="button"
            class="rounded-full px-4 py-2 text-[13px] font-medium transition"
            :class="status === 'ARCHIVE' ? activeSeg : inactiveSeg"
            @click="setStatus('ARCHIVE')"
          >
            Ended
          </button>
        </div>
      </div>

      <div
        v-if="loading || error"
        class="border-t border-black/5 px-4 sm:px-6 py-3"
      >
        <p v-if="loading" class="text-sm text-zinc-600">Loading items…</p>
        <p v-else class="text-sm text-red-600">{{ error }}</p>
      </div>
    </div>

    <div class="mt-8">
      <div class="flex items-center justify-between">
        <p class="text-sm text-zinc-600">
          <span class="font-medium text-zinc-900">{{ items.length }}</span>
          result{{ items.length === 1 ? "" : "s" }}
        </p>
      </div>

      <div
        v-if="!loading && items.length === 0"
        class="mt-6 rounded-2xl border border-black/5 bg-white p-8 text-center shadow-sm"
      >
        <h3 class="text-[15px] font-semibold text-zinc-900">No items found</h3>
        <p class="mt-2 text-sm text-zinc-600">
          Try a different keyword or adjust your categories.
        </p>
        <button
          type="button"
          class="mt-4 inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <ItemList v-else class="mt-6" :items="items" />
    </div>
  </div>
</template>

<script>
import Searchbar from "@/views/components/Searchbar.vue";
import ItemList from "@/views/components/ItemList.vue";
import { coreService } from "@/services/core.service";

export default {
  components: { Searchbar, ItemList },
  data() {
    return {
      items: [],
      categories: [],

      error: "",
      loading: true,

      searchQuery: "",
      status: "",
      selectedCategoryIds: [],
    };
  },
  computed: {
    activeSeg() {
      return "bg-zinc-900 text-white shadow-sm";
    },
    inactiveSeg() {
      return "border border-black/10 bg-white text-zinc-900 hover:bg-black/5";
    },
  },
  mounted() {
    coreService
      .getCategories()
      .then((cats) => {
        this.categories = Array.isArray(cats) ? cats : [];
      })
      .catch(() => {
        this.categories = [];
      })
      .finally(() => {
        this.fetchItems();
      });
  },
  methods: {
    setStatus(status) {
      this.status = status;
      this.fetchItems();
    },
    clearFilters() {
      this.searchQuery = "";
      this.status = "";
      this.selectedCategoryIds = [];
      this.fetchItems();
    },

    async fetchItems() {
      this.loading = true;
      this.error = "";

      try {
        const results = await coreService.searchItemsAdvanced(
          this.searchQuery,
          this.status,
          10,
          0,
          this.selectedCategoryIds
        );

        this.items = Array.isArray(results) ? results : [];
      } catch (err) {
        this.items = [];
        this.error = err || "Something went wrong";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
