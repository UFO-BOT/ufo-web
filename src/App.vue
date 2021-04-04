<template>
  <v-app id="app">
    <div class="content">
      <div>
        <Navbar></Navbar>
        <transition name="fade" mode="out-in" :duration="70">
          <router-view/>
        </transition>
      </div>
      <div>
        <Footer></Footer>
      </div>
    </div>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from "@/components/Footer";

export default {
  name: 'App',
  components: {
    Footer,
    Navbar
  }
};
</script>
<style>
#app {
  background-color: var(--v-background-base);
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;
  margin-bottom: 10px;
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
  color: #c62f5a !important;
  background-color: var(--v-code-base) !important;
  box-shadow: 1px 2px 6px -2px var(--v-blockShadow-base)!important;
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
  background: var(--v-scrollbarTrack-base);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: var(--v-scrollbarThumb-base);
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
::-moz-selection {
  background: #4444ff;
}

::selection {
  background: #4444ff;
}
</style>