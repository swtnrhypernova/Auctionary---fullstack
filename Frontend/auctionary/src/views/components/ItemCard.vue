<template>
  <router-link
    :to="`/item/${item.item_id}`"
    class="group block rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-zinc-900/10"
  >
    <div class="aspect-[16/10] w-full rounded-2xl bg-zinc-100 p-4">
      <div
        class="h-full w-full rounded-xl bg-gradient-to-b from-zinc-200 to-zinc-100"
      ></div>
    </div>

    <div class="p-5">
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-[15px] font-semibold leading-snug text-zinc-900">
          {{ item.name }}
        </h3>

        <span
          class="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700"
        >
          {{ priceText }}
        </span>
      </div>

      <p class="mt-2 text-sm leading-relaxed text-zinc-600 line-clamp-2">
        {{ item.description }}
      </p>

      <div class="mt-4 flex items-center justify-between">
        <p class="text-[13px] font-medium text-zinc-700">
          {{ item.first_name }} {{ item.last_name }}
        </p>

        <span
          class="text-[13px] font-medium text-zinc-900 transition group-hover:translate-x-0.5"
        >
          {{ countdownText }} →
        </span>
      </div>
    </div>
  </router-link>
</template>

<script>
import { formatCurrency, formatCountdown } from "@/utils/formatters";

export default {
  name: "ItemCard",
  props: {
    item: { type: Object, required: true },
  },
  computed: {
    priceText() {
      const amount = this.item.current_bid ?? this.item.starting_bid ?? 0;
      return formatCurrency(amount, "GBP");
    },
    countdownText() {
      if (!this.item?.end_date) return "View";
      const base = formatCountdown(this.item.end_date);
      return base === "Ended" ? "Ended" : `Ends in ${base}`;
    },
  },
};
</script>
