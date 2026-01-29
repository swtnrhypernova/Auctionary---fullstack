<template>
  <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <li v-for="item in items" :key="item.item_id">
      <ItemCard :item="item" />
    </li>
  </ul>
</template>

<script>
import ItemCard from "./ItemCard.vue";

export default {
  name: "ItemList",
  components: { ItemCard },
  props: {
    items: { type: Array, required: true },
  },
};
</script>
