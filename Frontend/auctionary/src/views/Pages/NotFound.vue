<template>
  <div class="py-16 sm:py-20">
    <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
      <div
        class="rounded-3xl border border-black/5 bg-white p-8 sm:p-12 shadow-sm text-center"
      >
        <p class="text-[13px] font-medium text-zinc-500">Error</p>

        <h1
          class="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900"
        >
          404 — Page not found
        </h1>

        <p class="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600">
          The page you’re looking for doesn’t exist, or the link is incorrect.
        </p>

        <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/"
            class="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-2.5 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-zinc-900/20"
          >
            Go home
          </router-link>

          <router-link
            to="/search"
            class="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-2.5 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
          >
            Browse items
          </router-link>
        </div>

        <p class="mt-8 text-[13px] text-zinc-500">
          If you think this is a mistake, try going back and checking the URL.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>
