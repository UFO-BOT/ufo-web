<template>
  <v-app id="app">
    <Navbar></Navbar>
    <router-view/>
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
  background-color: #21252b;
}
img {
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
code {
  padding: .3rem .5rem!important;
  font-size: .875em!important;
  color: #c62f7a !important;
  background-color: #0e1011 !important;
  border-radius: .25rem!important;
}

.fit-content {
  width: fit-content;
}

.no-hover:hover {
  background-color: inherit!important;
}

::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #181d1f;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #121315;
  border-radius: 10px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>