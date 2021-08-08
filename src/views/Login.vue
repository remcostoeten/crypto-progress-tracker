<template>
  <form @submit.prevent="submit">
    <messages :messages="messages"></messages>
    <h1 class="h3 mb-3 fw-normal">Please sign in</h1>
    <input v-model="email" type="email" class="form-control" placeholder="Email" required>
    <input v-model="password" type="password" class="form-control" placeholder="Password" required>
    <button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
  </form>

  <div class="message" v-for="message in messages">{{ message }}</div>

</template>

<script lang="ts">
import Messages from '@/components/Messages.vue';

export default {
  name: 'Login',
  components: {
    Messages
  },
  data () {
    return {
      messages: [],
      email: '',
      password: ''
    }
  },
  methods: {
    submit () {
      const login = async () => {
        const response = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        return await response.json();
      }

      login().then(response => {
        this.messages = [response.message];

        if (response.ok) {
          this.$router.push('/');
        }
      }).catch(error => {
        console.log(error);
      })
    }
  }
}
</script>