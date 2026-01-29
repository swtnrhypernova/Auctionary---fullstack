<template>
  <div class="mt-3">
    <button
      v-if="!showForm"
      type="button"
      class="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-3 py-1.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
      @click="showForm = true"
    >
      Answer
    </button>

    <div v-else class="rounded-2xl border border-black/5 bg-zinc-50 p-4">
      <div class="space-y-3">
        <div>
          <label class="sr-only">Type your answer</label>
          <input
            v-model="answer"
            placeholder="Type your answer…"
            class="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-900/30 focus:ring-4 focus:ring-zinc-900/10"
            @keydown.enter.prevent="submitAnswer"
            @blur="touched = true"
          />
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90"
            @click="submitAnswer"
          >
            Submit
          </button>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
            @click="cancel"
          >
            Cancel
          </button>
        </div>

        <p v-if="shouldShowError" class="text-sm text-red-600">
          Answer is required.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnswerForm",
  props: {
    questionId: { type: [Number, String], required: true },
  },
  emits: ["answer"],
  data() {
    return {
      answer: "",
      submitted: false,
      touched: false,
      showForm: false,
    };
  },
  computed: {
    shouldShowError() {
      const empty = this.answer.trim() === "";
      return (this.submitted || this.touched) && empty;
    },
  },
  methods: {
    submitAnswer() {
      this.submitted = true;

      const text = this.answer.trim();
      if (text === "") return;

      this.$emit("answer", {
        question_id: this.questionId,
        answer_text: text,
      });

      this.reset();
    },
    cancel() {
      this.reset();
    },
    reset() {
      this.answer = "";
      this.submitted = false;
      this.touched = false;
      this.showForm = false;
    },
  },
};
</script>
