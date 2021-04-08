<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>UFO</b></div>
    <v-img src="@/assets/logo.png" max-width="400px" max-height="300px" class="icon"></v-img>
    <span class="description"></span><br>
    <v-btn x-large color="primary" class="invite" @click="invite"><v-icon class="mr-2">mdi-discord</v-icon>{{ content.invite }}</v-btn>
    <div class="features-header">{{ content.featuresTitle }}</div>
    <div class="features-container">
      <v-card class="feature" color="block" v-for="feature of content.features">
        <div class="feature-name">{{ feature.name }}</div>
        <div class="feature-description">{{ feature.description }}</div>
      </v-card>
    </div>
    <DurationPicker v-model="duration"/>
    <div>{{ duration }}</div>
  </div>
</template>

<script>
import Typed from 'typed.js'
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from '@/config.json'
import DurationPicker from "@/components/DurationPicker";

let cookies = Cookies.parse()
let content = WebContent.home[cookies.language]

export default {
  name: 'Home',
  components: {DurationPicker},
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    duration: 1138149000
  }),
  methods: {
    invite() {
      window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&response_type=code&permissions=403549310&redirect_uri=${encodeURIComponent(window.location.origin + '/landing')}&scope=bot`
    }
  },
  mounted() {
    new Typed('.description', {
      strings: content.descriptions,
      typeSpeed: 50,
      backSpeed: 50,
      shuffle: true,
      backDelay: 3000,
      loop: true,
      cursorChar: '__'
    })
  }
}
</script>

<style scoped>
.name {
  margin: 0 0 10px;
  font-size: 4em;
}

.description {
  font-size: 1.8em;
}
.invite {
  font-size: 1.5em;
  margin-top: 5px;
}
.icon {
  margin: 10px;
}
.features-header {
  font-size: 2.2em;
  margin-top: 20px;
  font-weight: bold;
}
.features-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.feature {
  padding: 20px;
  margin: 5px 15px 10px;
  width: 300px;
}
.feature-name {
  font-size: 1.4em;
}
.feature-description {
  color: var(--v-opacityColor-base);
}
</style>