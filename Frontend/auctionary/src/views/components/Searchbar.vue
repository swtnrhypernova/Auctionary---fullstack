<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1">
        <span
          class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M16 16l5 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </span>

        <input
          :value="modelValue"
          placeholder="Search items…"
          class="w-full rounded-2xl border border-black/10 bg-white py-3 pl-11 pr-4 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
          @input="onInput"
        />
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
        @click="submitSearch"
      >
        Search
      </button>
    </div>

    <div
      v-if="categories.length"
      class="rounded-2xl border border-black/5 bg-zinc-50 p-4"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-[13px] font-medium text-zinc-700">Categories</p>

        <button
          v-if="selectedCategoryIds.length"
          type="button"
          class="text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition"
          @click="clearCategories"
        >
          Clear
        </button>
      </div>

      <div class="mt-3 flex flex-wrap gap-2">
        <label
          v-for="c in categories"
          :key="c.category_id"
          class="cursor-pointer"
        >
          <input
            class="sr-only"
            type="checkbox"
            :value="c.category_id"
            :checked="selectedCategoryIds.includes(c.category_id)"
            @change="toggleCategory(c.category_id)"
          />
          <span
            class="inline-flex items-center rounded-full border px-3 py-1.5 text-[13px] font-medium transition"
            :class="
              selectedCategoryIds.includes(c.category_id)
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-black/10 bg-white text-zinc-900 hover:bg-black/5'
            "
          >
            {{ c.name }}
          </span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: { type: Array, default: () => [] },
    modelValue: { type: String, default: "" },
    selectedCategoryIds: { type: Array, default: () => [] },
    debounceMs: { type: Number, default: 300 },
  },
  emits: ["update:modelValue", "update:selectedCategoryIds", "search"],
  data() {
    return { debounceTimer: null };
  },
  methods: {
    emitSearch() {
      this.$emit("search");
    },
    onInput(e) {
      this.$emit("update:modelValue", e.target.value);

      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.emitSearch(), this.debounceMs);
    },
    toggleCategory(id) {
      const next = this.selectedCategoryIds.includes(id)
        ? this.selectedCategoryIds.filter((x) => x !== id)
        : [...this.selectedCategoryIds, id];

      this.$emit("update:selectedCategoryIds", next);
      this.emitSearch();
    },
    clearCategories() {
      this.$emit("update:selectedCategoryIds", []);
      this.emitSearch();
    },
    submitSearch() {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.emitSearch();
    },
  },
  beforeUnmount() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  },
};
</script>
