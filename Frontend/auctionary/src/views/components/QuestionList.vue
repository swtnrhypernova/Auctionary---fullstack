<template>
  <div>
    <div
      v-if="!questions.length"
      class="rounded-2xl border border-black/5 bg-zinc-50 p-4"
    >
      <p class="text-sm text-zinc-600">No questions yet.</p>
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="q in questions"
        :key="q.question_id"
        class="rounded-3xl border border-black/5 bg-white p-5 shadow-sm"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <p class="text-[13px] font-medium text-zinc-500">Question</p>
            <p class="mt-1 text-sm leading-relaxed text-zinc-900">
              {{ q.question_text }}
            </p>
          </div>

          <span
            class="shrink-0 rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600"
          >
            #{{ q.question_id }}
          </span>
        </div>

        <div class="mt-4">
          <div
            v-if="q.answer_text"
            class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <p class="text-[13px] font-medium text-emerald-700">Answer</p>
            <p class="mt-1 text-sm leading-relaxed text-emerald-900">
              {{ q.answer_text }}
            </p>
          </div>

          <div v-else class="rounded-2xl border border-black/5 bg-zinc-50 p-4">
            <p class="text-sm text-zinc-600">No answer yet.</p>

            <AnswerForm
              v-if="canAnswer"
              :questionId="q.question_id"
              @answer="$emit('answer', $event)"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import AnswerForm from './AnswerForm.vue';

export default {
  name: "QuestionList",
  components: { AnswerForm },
  props: {
    questions: { type: Array, required: true },
    canAnswer: { type: Boolean, required: true },
  },
  emits: ["answer"],
};
</script>
