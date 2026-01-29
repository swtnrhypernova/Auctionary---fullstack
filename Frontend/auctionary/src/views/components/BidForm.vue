<template>
  <div class="space-y-2">
    <div class="flex gap-2">
      <div class="flex-1">
        <label class="sr-only">Bid amount</label>

        <div class="relative">
          <span
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-zinc-500"
          >
            £
          </span>

          <input
            type="number"
            :value="amount"
            :min="min"
            inputmode="numeric"
            placeholder="Enter bid amount"
            class="w-full rounded-2xl border border-black/10 bg-white pl-8 pr-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            @input="onInput"
            @keydown.enter.prevent="submitBid"
          />
        </div>
      </div>

      <button
        type="button"
        class="shrink-0 inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90"
        @click="submitBid"
      >
        Place bid
      </button>
    </div>

    <p v-if="submitted && amount === ''" class="text-sm text-red-600">
      Amount is required.
    </p>

    <p
      v-else-if="submitted && amount !== '' && Number(amount) < min"
      class="text-sm text-red-600"
    >
      Bid must be at least {{ minText }}.
    </p>

    <p class="text-[13px] text-zinc-500">
      Minimum: <span class="font-medium text-zinc-700">{{ minText }}</span>
    </p>
  </div>
</template>

<script>
import { formatCurrency } from "@/utils/formatters";

export default {
  name: "BidForm",
  props: {
    min: { type: Number, required: true },
  },
  emits: ["placeBid"],
  data() {
    return {
      amount: "",
      submitted: false,
    };
  },
  computed: {
    minText() {
      return formatCurrency(this.min, "GBP");
    },
  },
  methods: {
    onInput(e) {
      this.amount = e.target.value;
    },
    submitBid() {
      this.submitted = true;

      if (this.amount === "") return;

      const num = Number(this.amount);
      if (!Number.isFinite(num) || num < this.min) return;

      this.$emit("placeBid", num);

      this.amount = "";
      this.submitted = false;
    },
  },
};
</script>
