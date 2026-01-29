<template>
  <div class="py-10 sm:py-14">
    <p v-if="loading" class="text-sm text-zinc-600">Loading item…</p>

    <div v-else-if="item" class="space-y-6">
      <nav class="text-[13px] text-zinc-500">
        <router-link to="/" class="hover:text-zinc-900 transition"
          >Home</router-link
        >
        <span class="px-2">›</span>
        <router-link to="/search" class="hover:text-zinc-900 transition"
          >Search</router-link
        >
        <span class="px-2">›</span>
        <span class="text-zinc-700">{{ item.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section class="lg:col-span-2 space-y-6">
          <div
            class="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden"
          >
            <div class="aspect-[16/9] bg-zinc-100 p-6">
              <div
                class="h-full w-full rounded-2xl bg-gradient-to-b from-zinc-200 to-zinc-100 grid place-items-center"
              >
                <p class="text-sm text-zinc-500">Image will be updated soon</p>
              </div>
            </div>

            <div class="p-6 sm:p-8">
              <h1
                class="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900"
              >
                {{ item.name }}
              </h1>

              <p
                class="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600"
              >
                {{ item.description }}
              </p>

              <div
                class="mt-6 flex flex-wrap items-center gap-2 text-[13px] text-zinc-600"
              >
                <span
                  class="rounded-full border border-black/10 bg-white px-3 py-1.5"
                >
                  Current bid:
                  <span class="font-medium text-zinc-900">{{
                    currentBidText
                  }}</span>
                </span>

                <span
                  class="rounded-full border border-black/10 bg-white px-3 py-1.5"
                >
                  Ends in:
                  <span class="font-medium text-zinc-900">{{
                    countdownText
                  }}</span>
                </span>

                <router-link
                  :to="'/profile/' + item.creator_id"
                  class="rounded-full border border-black/10 bg-white px-3 py-1.5 hover:bg-black/5 transition"
                >
                  Seller:
                  <span class="font-medium text-zinc-900">
                    {{ item.first_name }} {{ item.last_name }}
                  </span>
                </router-link>
              </div>

              <div v-if="isLoggedIn && !isSeller" class="mt-4">
                <p
                  v-if="isWinning"
                  class="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-[13px] font-medium text-emerald-700"
                >
                  You are currently winning
                </p>
                <p
                  v-else
                  class="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-medium text-amber-700"
                >
                  You have been outbid
                </p>
              </div>

              <div
                v-if="message"
                class="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
              >
                {{ message }}
              </div>

              <div
                v-if="error"
                class="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {{ error }}
              </div>
            </div>
          </div>

          <div class="rounded-3xl border border-black/5 bg-white shadow-sm">
            <div class="p-6 sm:p-8">
              <div class="flex items-end justify-between gap-4">
                <div>
                  <h2 class="text-lg font-semibold text-zinc-900">Questions</h2>
                  <p class="mt-1 text-sm text-zinc-600">
                    Ask the seller anything about this item.
                  </p>
                </div>
              </div>

              <div class="mt-5">
                <QuestionForm
                  v-if="isLoggedIn && !isSeller"
                  @ask="handleAskQuestion"
                />

                <p
                  v-else-if="isLoggedIn && isSeller"
                  class="text-sm text-zinc-600"
                >
                  You are the seller, so you can’t ask a question.
                </p>

                <p v-else class="text-sm text-zinc-600">
                  Log in to ask a question.
                </p>
              </div>

              <div class="mt-6">
                <QuestionList
                  :questions="questions"
                  :canAnswer="isSeller"
                  @answer="handleAnswerQuestion"
                />
              </div>
            </div>
          </div>
        </section>

        <aside class="lg:col-span-1">
          <div class="lg:sticky lg:top-24 space-y-4">
            <div class="rounded-3xl border border-black/5 bg-white shadow-sm">
              <div class="p-6">
                <h3 class="text-[15px] font-semibold text-zinc-900">Bidding</h3>
                <p class="mt-1 text-sm text-zinc-600">
                  Minimum to beat:
                  <span class="font-medium text-zinc-900">{{
                    minimumToBeatText
                  }}</span>
                </p>

                <div class="mt-4">
                  <template v-if="isLoggedIn">
                    <template v-if="!isSeller">
                      <BidForm
                        :min="minimumToBeat + 1"
                        @placeBid="handlePlaceBid"
                      />
                    </template>
                    <p v-else class="text-sm text-zinc-600">
                      You are the seller of this item.
                    </p>
                  </template>

                  <template v-else>
                    <p class="text-sm text-zinc-600">
                      Log in to place bids, view bid history, and ask questions.
                    </p>

                    <div class="mt-4 flex flex-col gap-2">
                      <router-link
                        to="/login"
                        class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90"
                      >
                        Log in
                      </router-link>

                      <router-link
                        to="/register"
                        class="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
                      >
                        Create account
                      </router-link>
                    </div>
                  </template>
                </div>
              </div>

              <div v-if="isLoggedIn" class="border-t border-black/5 p-6">
                <h4 class="text-[13px] font-semibold text-zinc-900">
                  Bid history
                </h4>
                <p class="mt-1 text-sm text-zinc-600">
                  Most recent bids for this item.
                </p>

                <div class="mt-4">
                  <BidHistory :bids="bids" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <div
      v-else
      class="rounded-2xl border border-black/5 bg-white p-8 shadow-sm"
    >
      <h2 class="text-lg font-semibold text-zinc-900">Item not found</h2>
      <p class="mt-2 text-sm text-zinc-600">
        It may have been removed or the link is incorrect.
      </p>
      <router-link
        to="/search"
        class="mt-4 inline-flex rounded-2xl border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-zinc-900 shadow-sm hover:bg-black/5 transition"
      >
        Back to search
      </router-link>
    </div>
  </div>
</template>

<script>
import BidForm from "../components/BidForm.vue";
import BidHistory from "../components/BidHistory.vue";
import QuestionForm from "../components/QuestionForm.vue";
import QuestionList from "../components/QuestionList.vue";

import { coreService } from "../../services/core.service";
import { questionService } from "../../services/question.service";
import { authStore } from "@/services/auth.store";
import { formatCurrency, formatCountdown } from "@/utils/formatters";

export default {
  name: "ItemDetail",
  components: { BidForm, BidHistory, QuestionForm, QuestionList },

  data() {
    return {
      item: null,
      bids: [],
      questions: [],
      loading: true,
      error: "",
      message: "",
      timerId: null,
      countdownText: "",
    };
  },

  computed: {
    isLoggedIn() {
      return !!authStore.getToken();
    },
    myUserId() {
      return authStore.getUserId();
    },
    isSeller() {
      if (!this.item) return false;
      return String(this.item.creator_id) === String(this.myUserId);
    },
    isWinning() {
      if (!this.item?.current_bid_holder) return false;
      return (
        String(this.item.current_bid_holder.user_id) === String(this.myUserId)
      );
    },
    minimumToBeat() {
      if (!this.item) return 0;
      const current = Number(this.item.current_bid ?? 0);
      const starting = Number(this.item.starting_bid ?? 0);
      return Math.max(current, starting);
    },
    currentBidText() {
      return formatCurrency(this.item?.current_bid ?? 0, "GBP");
    },
    minimumToBeatText() {
      return formatCurrency(this.minimumToBeat + 1, "GBP");
    },
  },

  async mounted() {
    await this.load();
    this.startCountdownTimer();
  },

  beforeUnmount() {
    this.stopCountdownTimer();
  },

  watch: {
    // Reload when navigating between items
    "$route.params.item_id": {
      immediate: false,
      async handler() {
        await this.load();
        this.startCountdownTimer();
      },
    },
    // If item becomes null (load failure), stop ticking
    item(newVal) {
      if (!newVal) this.stopCountdownTimer();
    },
  },

  methods: {
    itemId() {
      return this.$route.params.item_id;
    },

    resetAlerts() {
      this.message = "";
      this.error = "";
    },

    startCountdownTimer() {
      this.stopCountdownTimer();
      this.updateCountdown();
      this.timerId = setInterval(this.updateCountdown, 1000);
    },

    stopCountdownTimer() {
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = null;
    },

    updateCountdown() {
      if (!this.item?.end_date) {
        this.countdownText = "—";
        return;
      }

      const text = formatCountdown(this.item.end_date);
      this.countdownText = text === "Ended" ? "Auction ended" : text;

      if (text === "Ended") this.stopCountdownTimer();
    },

    async load() {
      this.loading = true;
      this.item = null;
      this.bids = [];
      this.questions = [];
      this.error = "";
      this.message = "";

      try {
        const item_id = this.itemId();

        this.item = await coreService.getSingleItem(item_id);

        const [questions, bids] = await Promise.all([
          questionService.getQuestionsForItem(item_id),
          this.isLoggedIn
            ? coreService.getBidHistory(item_id)
            : Promise.resolve([]),
        ]);

        this.questions = Array.isArray(questions) ? questions : [];
        this.bids = Array.isArray(bids) ? bids : [];
      } catch (err) {
        this.error = err || "Something went wrong";
      } finally {
        this.loading = false;
      }
    },

    async refreshAfterBidOrAnswer() {
      const item_id = this.itemId();

      const [item, bids, questions] = await Promise.all([
        coreService.getSingleItem(item_id),
        this.isLoggedIn
          ? coreService.getBidHistory(item_id)
          : Promise.resolve([]),
        questionService.getQuestionsForItem(item_id),
      ]);

      this.item = item;
      this.bids = Array.isArray(bids) ? bids : [];
      this.questions = Array.isArray(questions) ? questions : [];
      this.updateCountdown();
    },

    async handlePlaceBid(amount) {
      this.resetAlerts();

      if (!this.isLoggedIn) return this.$router.push("/login");
      if (this.isSeller)
        return (this.error = "You cannot bid on your own item");
      if (amount <= this.minimumToBeat) {
        this.error = `Bid must be higher than ${formatCurrency(
          this.minimumToBeat,
          "GBP"
        )}`;
        return;
      }

      try {
        await coreService.placeBid(this.itemId(), amount);
        await this.refreshAfterBidOrAnswer();
        this.message = "Bid placed successfully";
      } catch (err) {
        this.error = err || "Something went wrong";
      }
    },

    async handleAskQuestion(text) {
      this.resetAlerts();

      if (!this.isLoggedIn) return this.$router.push("/login");
      if (this.isSeller)
        return (this.error = "You cannot ask a question on your own item");

      try {
        await questionService.askQuestionForItem(this.itemId(), text);
        this.questions = await questionService.getQuestionsForItem(
          this.itemId()
        );
        this.message = "Question submitted";
      } catch (err) {
        this.error = err || "Something went wrong";
      }
    },

    async handleAnswerQuestion(payload) {
      this.resetAlerts();

      if (!this.isSeller)
        return (this.error = "Only the seller can answer questions");

      try {
        await questionService.answerQuestion(
          payload.question_id,
          payload.answer_text
        );
        this.questions = await questionService.getQuestionsForItem(
          this.itemId()
        );
        this.message = "Answer posted";
      } catch (err) {
        this.error = err || "Something went wrong";
      }
    },
  },
};
</script>
