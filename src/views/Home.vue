<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>UFO</b></div>
    <v-img src="@/assets/logo.png" max-width="400px" max-height="300px" class="icon"></v-img>
    <span class="description"></span><br>
    <v-btn x-large color="primary" class="invite" @click="invite"><v-icon class="mr-2" large>discord</v-icon>{{ content.invite }}</v-btn>
    <div class="features-header">{{ content.featuresTitle }}</div>
    <div class="features-container">
      <v-card class="feature" color="block" v-for="feature of content.features">
        <div class="feature-name">{{ feature.name }}</div>
        <div class="feature-description">{{ feature.description }}</div>
      </v-card>
    </div>
  </div>
</template>

<script>
import Typed from 'typed.js'
import WebContent from '@/content.json'
import config from '@/config.json'

let content = WebContent.home[localStorage.getItem('language')]

export default {
  name: 'Home',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  }),
  methods: {
    invite() {
      window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${config.botID}&response_type=code&permissions=1515519995134&redirect_uri=${encodeURIComponent(window.location.origin + '/landing')}&scope=bot`
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
  font-size: 1.4em;
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
