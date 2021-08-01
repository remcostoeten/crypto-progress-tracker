<template>
  <div class="header">
    <div class="header__menu">
      <div class="menu__logo">
        <img style="height: 60px;" alt="Vue logo" src="/images/logo.png">
      </div>
      <ul>
        <li>
          <router-link to="/"><span>Home</span></router-link>
        </li>
        <li>
          <router-link to="/calculator"><span>Calculator</span></router-link>
        </li>
        <li>
          <router-link to="/demo"><span>Demo</span></router-link>
        </li>
        <div class="login-wrapper" v-if="!auth">
          <li>
            <router-link to="/register"><span>Register</span></router-link>
          </li>
          <li class="login action primary smooth-animation">
            <router-link to="/login"><span>Login</span></router-link>
          </li>
        </div>
      </ul>
      <ul v-if="auth">
        <li>
          <a href="/login" class="nav-link" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
    <div class="inner">
      <h2>Crypto portfolio progress</h2>
      <div class="header__background">
        <div class="overlay"></div>
      </div>
    </div>
  </div>
  <router-view/>
</template>


<script>
import {computed} from 'vue';
import {useStore} from 'vuex';

export default {
  name: "nav",
  setup() {
    const store = useStore();

    const auth = computed(() => store.state.authenticated);

    const logout = async () => {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
      });
    }

    return {
      auth,
      logout
    }
  }
}
</script>
