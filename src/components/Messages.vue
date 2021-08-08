<template>
  <div class="message" v-for="message in messages">{{ message }}</div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: []
    }
  }
}
</script>
