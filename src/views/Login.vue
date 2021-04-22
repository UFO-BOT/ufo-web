<template>
  <div style="text-align: -webkit-center">
    <div class="name">{{ content.name }}</div>
    <v-progress-circular
        :size="100"
        :width="7"
        color="white"
        indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Oauth2 from "@/util/oauth2";

let content = WebContent.login[localStorage.getItem('language')]

export default {
  name: "Login",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  }),
  async mounted() {
    let response = await Oauth2.getAccessToken(this.$route.query.code)
    if(response.accessToken) window.location.replace('/@me')
    else window.location.replace('/')
  }
}
</script>

<style scoped>
.name {
  margin: 15px;
  font-size: 3em;
}
</style>