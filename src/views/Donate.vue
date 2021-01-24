<template>
  <div style="text-align: -webkit-center" class="content">
    <div class="name"><b>{{ content.name }}</b></div>
    <div class="description" v-html="content.description"></div>
    <v-expansion-panels accordion dark focusable>
      <v-expansion-panel v-for="feature of content.features">
        <v-expansion-panel-header v-ripple class="feature-name">{{ feature.name }}</v-expansion-panel-header>
        <v-expansion-panel-content class="feature-description">{{ feature.description }}</v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import CookieParser from '@/util/Cookies'

let cookies = CookieParser.parse()
let content = WebContent.donate[cookies.language]

export default {
  name: "Donate",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  })
}
</script>

<style scoped>
.content {
  padding-right: 20px;
  padding-left: 20px;
}
.name {
  color: white;
  font-size: 3.5em;
}
.description {
  font-size: 1.4em;
  color: #9c9c9c;
  text-align: left;
  margin-bottom: 10px;
}
.feature-name {
  font-size: 1.4em;
}
.feature-description {
  text-align: left;
  margin-top: 10px;
}
</style>