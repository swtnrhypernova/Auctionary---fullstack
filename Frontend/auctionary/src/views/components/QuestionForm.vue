<template>
  <div class="rounded-2xl border border-black/5 bg-zinc-50 p-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="flex-1">
        <label class="sr-only">Ask a question</label>
        <input
          v-model="question"
          placeholder="Ask a question…"
          class="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
          @keydown.enter.prevent="submitQuestion"
          @blur="touched = true"
        />
      </div>

      <button
        type="button"
        class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90"
        @click="submitQuestion"
      >
        Submit
      </button>
    </div>

    <p v-if="shouldShowError" class="mt-2 text-sm text-red-600">
      Question is required.
    </p>

    <p class="mt-2 text-[13px] text-zinc-500">
      Keep it short and specific — sellers reply faster.
    </p>
  </div>
</template>

<script>
export default {
  name: "QuestionForm",
  emits: ["ask"],
  data() {
    return {
      question: "",
      submitted: false,
      touched: false,
    };
  },
  computed: {
    shouldShowError() {
      const empty = this.question.trim() === "";
      return (this.submitted || this.touched) && empty;
    },
  },
  methods: {
    submitQuestion() {
      this.submitted = true;

      const text = this.question.trim();
      if (text === "") return;

      this.$emit("ask", text);

      this.question = "";
      this.submitted = false;
      this.touched = false;
    },
  },
};
</script>
