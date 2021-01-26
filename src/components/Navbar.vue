<template>
  <div>
    <v-toolbar>
      <v-app-bar-nav-icon id="nav-menu" @click="mobileNav = !mobileNav"></v-app-bar-nav-icon>
      <v-toolbar-title style="padding: 3px 5px 3px 3px">UFO</v-toolbar-title>
      <v-toolbar-items style="margin-left: 12px" id="nav-links">
        <v-btn v-for="link of links" text :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">{{ link.name }}</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items style="margin-left: 10px">
        <v-btn text @click="translate()"><v-icon large>translate</v-icon></v-btn>
        <v-btn text :href="`https://discord.com/api/oauth2/authorize?client_id=705372408281825350&redirect_uri=${encodeURIComponent(location + '/login')}&response_type=code&scope=identify%20guilds`" v-if="!loadingUser && !user.username">{{ content.login.name }}</v-btn>
        <v-btn text disabled v-if="loadingUser && !user.username"><v-progress-circular indeterminate color="white"></v-progress-circular></v-btn>
        <v-btn text @click="mobileNav = false" to="/@me" v-if="user.username"><v-avatar><img :src="user.avatarURL" class="user-avatar" alt="Avatar"></v-avatar> <span class="user-username">{{ user.username }}</span></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list flat v-if="mobileNav" :style="{marginTop: '5px'}">
      <v-list-item-group color="primary" v-for="link of links">
        <v-list-item @click="mobileNav = false" :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">{{ link.name }}</v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import Cookies from '@/util/Cookies'
import Oauth2 from '@/util/Oauth2'

let cookies = Cookies.parse()
import content from '@/content.json'
import config from '@/config.json'
let links = content.nav[cookies.language].list;

export default {
  name: "Navbar",
  data: () => ({
    mobileNav: false,
    links: links,
    content: content.nav[cookies.language],
    config,
    loadingUser: Boolean(cookies.token),
    location: window.location.origin,
    translate: () => {
      Cookies.set('language', cookies.language === 'ru' ? 'en' : 'ru', 1e15)
      window.location.reload()
    }
  }),
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  async mounted() {
    if(cookies.token) {
      this.loadingUser = true;
      await this.$store.dispatch('getUser')
      this.loadingUser = false;
    }
  }
}
</script>

<style scoped>
@media screen and (max-width: 1000px) {
  #nav-menu {
    display: block;
  }
  #nav-links {
    display: none;
  }
}
@media screen and (min-width: 1000px) {
  #nav-menu {
    display: none;
  }
  #nav-links {
    display: block;
  }
}
@media screen and (max-width: 600px){
  .user-username {
    display: none;
  }
}
@media screen and (min-width: 600px){
  .user-username {
    display: inline;
  }
}
.user-avatar {
  margin-right: 5px;
  width: 40px;
  height: 40px;
}
</style>