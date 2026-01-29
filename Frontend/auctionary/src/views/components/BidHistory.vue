<template>
  <div>
    <div
      v-if="!bids.length"
      class="rounded-2xl border border-black/5 bg-zinc-50 p-4"
    >
      <p class="text-sm text-zinc-600">No bids yet.</p>
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="bid in bids"
        :key="bidKey(bid)"
        class="rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium text-zinc-900">
            {{ formatAmount(bid.amount) }}
          </p>
          <p class="text-[13px] text-zinc-600">
            {{ bid.first_name }} {{ bid.last_name }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { formatCurrency } from "@/utils/formatters";

export default {
  name: "BidHistory",
  props: {
    bids: { type: Array, default: () => [] },
  },
  methods: {
    formatAmount(value) {
      return formatCurrency(value, "GBP");
    },
    bidKey(bid) {
      return `${bid.item_id}-${bid.user_id}-${bid.amount}-${
        bid.timestamp ?? ""
      }`;
    },
  },
};
</script>
