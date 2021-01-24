<template>
  <div>
    <v-toolbar dark>
      <v-app-bar-nav-icon id="nav-menu" @click="mobileNav = !mobileNav"></v-app-bar-nav-icon>
      <v-toolbar-title style="padding: 3px 5px 3px 3px">UFO</v-toolbar-title>
      <v-toolbar-items style="margin-left: 12px" id="nav-links">
        <v-btn v-for="link of links" text :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">{{ link.name }}</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items style="margin-left: 10px">
        <v-btn text @click="translate()"><v-icon large>translate</v-icon></v-btn>
        <v-btn text :href="config.API + content.login.path" v-if="!loadingUser && !user.username">{{ content.login.name }}</v-btn>
        <v-btn text disabled v-if="loadingUser && !user.username"><v-progress-circular indeterminate color="white"></v-progress-circular></v-btn>
        <v-btn text to="/@me" v-if="user.username"><img :src="UserAvatar(user)" alt="Avatar" class="user-avatar"> <span class="user-username">{{ user.username }}</span></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list flat dark v-if="mobileNav" :style="{marginTop: '5px'}">
      <v-list-item-group color="primary" v-for="link of links">
        <v-list-item dark @click="mobileNav = false" :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">{{ link.name }}</v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import Cookies from '@/util/Cookies'
import Oauth2 from '@/util/Oauth2'
import UserAvatar from "@/util/UserAvatar";

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
    user: {},
    UserAvatar,
    translate: () => {
      Cookies.set('language', cookies.language === 'ru' ? 'en' : 'ru', 1e15)
      window.location.reload()
    }
  }),
  async mounted() {
    let token = cookies.token;
    if (Date.now() > Number(cookies.tokenExpiresTimestamp) && cookies.refreshToken) {
      let response = await Oauth2.refreshToken(cookies.refreshToken).catch(() => {
      })
      token = response.accessToken;
    }
    if (cookies.token) {
      Oauth2.getUser(token).then(user => {
        this.user = user;
        this.loadingUser = false;
      }).catch(() => {
        this.loadingUser = false;
      })
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>