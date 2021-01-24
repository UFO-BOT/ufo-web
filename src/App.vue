<template>
  <v-app id="app">
    <Navbar></Navbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>
<style>
#app {
  background-color: #252a31;
}
img {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
code {
  padding: .2rem .4rem!important;
  font-size: .875em!important;
  color: #fff!important;
  background-color: #212529!important;
  border-radius: .2rem!important;
}
</style>