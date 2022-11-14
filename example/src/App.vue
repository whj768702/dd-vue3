<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/demo">Demo</router-link> |
    <router-link to="/simple">Simple Demo</router-link> |
    <router-link to="/tree">Tree Demo</router-link> |
    <router-link to="/nested">Nested Demo</router-link> |
    <router-link to="/horizontal">Horizontal Demo</router-link> |
    <router-link to="/handle">Handle Demo</router-link> |
    <router-link to="/itemTypes">ItemTypes Demo</router-link> |
  </nav>
  <router-view/>
</template>

<style lang="less">
@import './styles/index.less';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
