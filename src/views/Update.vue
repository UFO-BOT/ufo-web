<template>
  <div style="text-align: -webkit-center">
    <v-scale-transition mode="out-in" :duration="1000">
      <div v-if="error" class="error-code"><b>404</b></div>
      <div v-if="title" class="version">2.0.0</div>
    </v-scale-transition>
    <v-fade-transition name="fade" mode="out-in" :duration="1000">
      <div v-if="counter < 3" class="description">{{ content.descriptions[counter] }}</div>
    </v-fade-transition>
    <v-fade-transition mode="out-in" :duration="1000">
      <v-btn v-if="counter < 3" x-large color="secondary" class="home" :disabled="counter === 3" @click="click">
        <v-icon class="mr-2" large>home</v-icon>{{ content.home }}
      </v-btn>
    </v-fade-transition>
    <v-scale-transition mode="out-in" :duration="1000">
      <div v-if="logo">
        <v-img v-if="$vuetify.theme.dark" src="@/assets/logo-v2-dark.png" class="logo item-center"></v-img>
        <v-img v-else src="@/assets/logo-v2-light.png" class="logo item-center"></v-img>
      </div>
    </v-scale-transition>
    <v-fade-transition mode="out-in" :duration="1000">
      <div v-if="showTimer" class="timer">{{ timer }}</div>
    </v-fade-transition>
  </div>
</template>

<script>
import WebContent from '@/content.json'

let content = WebContent.update[localStorage.getItem('language')]

export default {
  name: 'Update',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    counter: 0,
    error: true,
    title: false,
    logo: false,
    showTimer: false,
    timer: ''
  }),
  methods: {
    async click() {
      this.counter ++
      if (this.counter === 3) {
        setTimeout(() => this.error = false, 2000)
        setTimeout(() => this.title = true, 4000)
        setTimeout(() => this.logo = true, 5000)
        setTimeout(() => setInterval(this.setTimer, 1000), 6000)
      }
    },
    setTimer() {
      this.timer = ''
      this.showTimer = true
      let time = 1723280400000 - Date.now()
      let dividers = [86400000, 3600000, 60000, 1000]
      for (let divider of dividers) {
        let num = Math.floor(time / divider)
        this.timer += (([1000, 60000].includes(divider) && num < 10) ? '0' : '')
            + num.toString() + (divider === 1000 ? '' : ':')
        time -= divider * num
      }
    }
  }
}
</script>

<style scoped>
.error-code {
  font-size: 10em;
}

.description {
  margin: 10px;
  font-size: 3em;
  width: 80%;
}

.home {
  font-size: 1.5em;
  margin: 10px 10px;
}

.version {
  font-size: 4em;
  font-weight: bold;
}

.logo {
  max-width: 400px;
  max-height: 300px;
}

.timer {
  margin-top: 10px;
  font-size: 3em;
  font-weight: bold;
}
</style>