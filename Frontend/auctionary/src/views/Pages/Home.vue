<template>
  <main>
    <!-- Hero -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
      <div
        class="rounded-3xl border border-black/5 bg-gradient-to-b from-zinc-50 to-white p-8 sm:p-12 shadow-soft"
      >
        <p class="text-[13px] font-medium text-zinc-500">Auctionary</p>

        <h1
          class="mt-2 text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900"
        >
          Buy. Bid. Sell.
          <span class="text-zinc-500">Smoothly.</span>
        </h1>

        <p
          class="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-600"
        >
          Browse auctions, ask questions, and place bids with a clean, modern
          flow. No clutter — just the important stuff.
        </p>

        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <router-link
            to="/search"
            class="inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3 text-[13px] font-medium text-white shadow-sm transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-zinc-900/30"
          >
            Search items
          </router-link>

          <router-link
            v-if="isLoggedIn"
            to="/item/create"
            class="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
          >
            Start selling
          </router-link>

          <router-link
            v-else
            to="/register"
            class="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-black/5"
          >
            Create an account
          </router-link>
        </div>
      </div>
    </section>

    <!-- Feature cards -->
    <section class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
          <h3 class="text-[15px] font-semibold text-zinc-900">Discover</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">
            Search items quickly and filter to what you actually want.
          </p>
        </div>

        <div class="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
          <h3 class="text-[15px] font-semibold text-zinc-900">
            Bid confidently
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">
            See details clearly, place bids easily, and track auction activity.
          </p>
        </div>

        <div class="rounded-2xl border border-black/5 bg-white p-6 shadow-soft">
          <h3 class="text-[15px] font-semibold text-zinc-900">Sell simply</h3>
          <p class="mt-2 text-sm leading-relaxed text-zinc-600">
            Create listings fast, save drafts, and publish when you’re ready.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "Home",
  props: {
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
