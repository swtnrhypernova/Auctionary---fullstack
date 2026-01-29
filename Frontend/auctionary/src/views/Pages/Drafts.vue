<template>
  <div class="py-10 sm:py-14">
    <!-- Header -->
    <div
      class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p class="text-[13px] font-medium text-zinc-500">Sell</p>
        <h1
          class="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900"
        >
          Drafts
        </h1>
        <p
          class="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-zinc-600"
        >
          Save unfinished listings and come back to them later.
        </p>
      </div>

      <router-link
        to="/item/create"
        class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
      >
        Create new
      </router-link>
    </div>

    <!-- Empty state -->
    <div
      v-if="drafts.length === 0"
      class="mt-6 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm"
    >
      <h3 class="text-[15px] font-semibold text-zinc-900">No drafts yet</h3>
      <p class="mt-2 text-sm text-zinc-600">
        Start a listing and hit “Save draft” to keep it here.
      </p>

      <router-link
        to="/item/create"
        class="mt-4 inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
      >
        Create a draft
      </router-link>
    </div>

    <!-- Draft list -->
    <div v-else class="mt-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <article
          v-for="d in drafts"
          :key="d.draft_id"
          class="rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div class="p-6">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-[15px] font-semibold leading-snug text-zinc-900">
                {{ d.name || "Untitled draft" }}
              </h3>

              <span
                class="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600"
              >
                #{{ d.draft_id }}
              </span>
            </div>

            <p class="mt-2 text-sm leading-relaxed text-zinc-600 line-clamp-3">
              {{ d.description || "No description yet." }}
            </p>

            <div class="mt-4 space-y-1 text-[13px] text-zinc-600">
              <p>
                Starting bid:
                <span class="font-medium text-zinc-900">{{
                  d.starting_bid || "—"
                }}</span>
              </p>
              <p>
                End date:
                <span class="font-medium text-zinc-900">{{
                  d.end_date || "—"
                }}</span>
              </p>
            </div>
          </div>

          <div
            class="border-t border-black/5 p-4 flex items-center justify-between gap-2"
          >
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
              @click="editDraft(d.draft_id)"
            >
              Edit
            </button>

            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-[13px] font-medium text-red-700 shadow-sm transition hover:bg-red-100"
              @click="removeDraft(d.draft_id)"
            >
              Delete
            </button>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { draftService } from "@/services/draft.service";

export default {
  name: "Drafts",
  data() {
    return {
      drafts: [],
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.drafts = draftService.listDrafts();
    },
    editDraft(draft_id) {
      this.$router.push({ path: "/item/create", query: { draft_id } });
    },
    removeDraft(draft_id) {
      draftService.deleteDraft(draft_id);
      this.refresh();
    },
  },
};
</script>
