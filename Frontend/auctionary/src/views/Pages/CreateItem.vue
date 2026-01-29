<template>
  <div class="py-10 sm:py-14">
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-[13px] font-medium text-zinc-500">Sell</p>
        <h1
          class="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900"
        >
          Create an item
        </h1>
        <p
          class="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600"
        >
          Add details, choose categories, and publish your auction. You can save
          as a draft anytime.
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
          @click="saveDraftNow"
        >
          Save draft
        </button>

        <button
          v-if="draft_id"
          type="button"
          class="inline-flex items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-700 shadow-sm transition hover:bg-red-100"
          @click="deleteDraftNow"
        >
          Delete draft
        </button>
      </div>
    </div>

    <div class="mt-6 space-y-3">
      <div
        v-if="message"
        class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {{ message }}
      </div>

      <div
        v-if="submitted && error"
        class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ error }}
      </div>
    </div>

    <div
      class="mt-6 rounded-3xl border border-black/5 bg-white p-6 sm:p-8 shadow-sm"
    >
      <form @submit.prevent="submitItem" class="space-y-6">
        <div>
          <label class="block text-[13px] font-medium text-zinc-700"
            >Item name</label
          >
          <input
            v-model="name"
            type="text"
            placeholder="e.g., Vintage camera"
            class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
          />
        </div>

        <div>
          <label class="block text-[13px] font-medium text-zinc-700"
            >Description</label
          >
          <textarea
            v-model="description"
            rows="5"
            placeholder="Describe the item, condition, included accessories, etc."
            class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-[13px] font-medium text-zinc-700"
              >Starting bid</label
            >
            <input
              type="number"
              v-model="starting_bid"
              placeholder="e.g., 10"
              min="1"
              step="1"
              class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            />
            <p class="mt-2 text-[13px] text-zinc-500">
              Enter a whole number amount.
            </p>
          </div>

          <div>
            <label class="block text-[13px] font-medium text-zinc-700"
              >End date</label
            >
            <input
              type="date"
              v-model="end_date"
              class="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            />
            <p class="mt-2 text-[13px] text-zinc-500">
              The auction ends at midnight (local time).
            </p>
          </div>
        </div>

        <div
          v-if="categories.length"
          class="rounded-2xl border border-black/5 bg-zinc-50 p-5"
        >
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-[13px] font-semibold text-zinc-900">Categories</p>
              <p class="mt-1 text-sm text-zinc-600">Select all that apply.</p>
            </div>

            <button
              v-if="selectedCategoryIds.length"
              type="button"
              class="text-[13px] font-medium text-zinc-600 hover:text-zinc-900 transition"
              @click="selectedCategoryIds = []"
            >
              Clear
            </button>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            <label
              v-for="c in categories"
              :key="c.category_id"
              class="cursor-pointer"
            >
              <input
                class="sr-only"
                type="checkbox"
                :value="c.category_id"
                v-model="selectedCategoryIds"
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

        <div
          class="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
        >
          <p class="text-[13px] text-zinc-500">
            Tip: Save draft if you’re not ready to post yet.
          </p>

          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { coreService } from "@/services/core.service";
import { draftService } from "@/services/draft.service";

export default {
  data() {
    return {
      draft_id: null,
      name: "",
      description: "",
      starting_bid: "",
      end_date: "",
      categories: [],
      selectedCategoryIds: [],
      submitted: false,
      error: "",
      message: "",
    };
  },

  async mounted() {
    await this.loadCategories();
    this.loadDraftFromRoute();
  },

  methods: {
    resetAlerts() {
      this.error = "";
      this.message = "";
    },

    async loadCategories() {
      try {
        const cats = await coreService.getCategories();
        this.categories = Array.isArray(cats) ? cats : [];
      } catch {
        this.categories = [];
      }
    },

    loadDraftFromRoute() {
      const draft_id = this.$route.query.draft_id;
      if (!draft_id) return;

      const d = draftService.getDraft(draft_id);
      if (!d) return;

      this.draft_id = d.draft_id;
      this.name = d.name || "";
      this.description = d.description || "";
      this.starting_bid = d.starting_bid ?? "";
      this.end_date = d.end_date || "";
      this.selectedCategoryIds = Array.isArray(d.category_ids)
        ? d.category_ids
        : [];
      this.message = "Draft loaded";
    },

    validate() {
      const name = this.name.trim();
      const description = this.description.trim();
      const bid = Number(this.starting_bid);

      if (!name || !description || !this.end_date || !this.starting_bid) {
        this.error = "All fields are required";
        return false;
      }

      if (!Number.isFinite(bid) || bid < 1 || !Number.isInteger(bid)) {
        this.error = "Starting bid must be a whole number greater than 0";
        return false;
      }

      // Basic date sanity check (yyyy-mm-dd)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(this.end_date)) {
        this.error = "End date must be a valid date";
        return false;
      }

      return true;
    },

    // End date ends at midnight local time.
    // Using local components avoids timezone shift issues.
    toEndUnixSeconds(dateStr) {
      const [y, m, d] = dateStr.split("-").map(Number);
      // midnight local time
      const localMidnight = new Date(y, m - 1, d, 0, 0, 0);
      return Math.floor(localMidnight.getTime() / 1000);
    },

    saveDraftNow() {
      this.resetAlerts();

      const saved = draftService.saveDraft({
        draft_id: this.draft_id,
        name: this.name,
        description: this.description,
        starting_bid: this.starting_bid,
        end_date: this.end_date,
        category_ids: this.selectedCategoryIds,
      });

      this.draft_id = saved.draft_id;
      this.message = "Draft saved";
    },

    deleteDraftNow() {
      if (!this.draft_id) return;

      draftService.deleteDraft(this.draft_id);

      this.draft_id = null;
      this.message = "Draft deleted";
    },

    async submitItem() {
      this.submitted = true;
      this.resetAlerts();

      if (!this.validate()) return;

      const endUnix = this.toEndUnixSeconds(this.end_date);

      try {
        const data = await coreService.createItem(
          this.name.trim(),
          this.description.trim(),
          Number(this.starting_bid),
          endUnix,
          this.selectedCategoryIds
        );

        if (this.draft_id) {
          draftService.deleteDraft(this.draft_id);
        }

        this.$router.push("/item/" + data.item_id);
      } catch (err) {
        this.error = err || "Something went wrong";
      }
    },
  },
};
</script>
