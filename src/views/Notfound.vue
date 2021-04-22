<template>
  <div style="text-align: -webkit-center">
    <div class="error-code"><b>404</b></div>
    <div class="description">{{ content.name }}</div>
    <v-btn x-large color="secondary" class="home" to="/">{{ content.home }}</v-btn>
  </div>
</template>

<script>
import WebContent from '@/content.json'

let content = WebContent.notfound[localStorage.getItem('language')]

export default {
  name: 'Home',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  })
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
</style>