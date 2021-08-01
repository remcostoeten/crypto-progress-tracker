<template>
  <div class="home">
    <HelloWorld msg="Crypto portfolio tracking sheet"/>
    {{message}}
  </div>
</template>

<script>
import {onMounted, ref} from 'vue';
export default {
  name: 'Home',
  setup() {
    const message = ref('You are not logged in!')
    onMounted(async () => {
      const response = await fetch('http://localhost:8000/api/user', {
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      });

      const content = await response.json();

      message.value = `Welkom ${content.name}`;
    });

    return {
      message
    }
  }
}
</script>
