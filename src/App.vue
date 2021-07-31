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
        <li class="login action primary smooth-animation">
          <router-link to="/login"><span>Login</span></router-link>
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

