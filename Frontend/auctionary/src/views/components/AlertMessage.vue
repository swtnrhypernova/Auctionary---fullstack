<template>
  <div
    v-if="message"
    class="rounded-2xl px-4 py-3 text-sm shadow-sm transition"
    :class="variantClass"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: "",
    },
    variant: {
      type: String,
      default: "default", // "default" | "success" | "error"
    },
  },
  computed: {
    variantClass() {
      switch (this.variant) {
        case "success":
          return "border border-emerald-200 bg-emerald-50 text-emerald-700";
        case "error":
          return "border border-red-200 bg-red-50 text-red-700";
        default:
          return "border border-black/5 bg-white text-zinc-700";
      }
    },
  },
};
</script>
