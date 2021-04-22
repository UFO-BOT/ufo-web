<template>
  <div>
    <v-toolbar color="navbar" dark>
      <v-app-bar-nav-icon id="nav-menu" @click="mobileNav = !mobileNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="pa-0 pl-1"><router-link to="/"><img src="@/assets/logo.png" alt="UFO Logo" class="main-icon"/></router-link></v-toolbar-title>
      <v-toolbar-items style="margin-left: 12px" id="nav-links">
        <v-btn v-for="link of links" text :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">
          <v-icon class="nav-icon">{{ link.icon }}</v-icon>{{ link.name }}
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items style="margin-left: 10px">
        <v-btn text @click="translate()"><v-icon large>translate</v-icon></v-btn>
        <v-btn text :href="`https://discord.com/api/oauth2/authorize?client_id=705372408281825350&redirect_uri=${encodeURIComponent(location + '/login')}&response_type=code&scope=identify%20guilds`" v-if="!loadingUser && !user.username">
          <v-icon small class="nav-icon">{{ content.login.icon }}</v-icon>{{ content.login.name }}
        </v-btn>
        <v-btn text disabled v-if="loadingUser && !user.username"><v-progress-circular indeterminate color="white"></v-progress-circular></v-btn>
        <v-btn text @click="mobileNav = false" to="/@me" v-if="user.username"><v-avatar><img :src="user.avatarURL" class="user-avatar" alt="Avatar"></v-avatar> <span class="user-username">{{ user.username }}</span></v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-list v-if="mobileNav" color="mobileNav mt-2 mb-2" class="mobileNav">
      <v-list-item-group color="primary">
        <v-list-item v-for="link of links" @click="mobileNav = false" :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">
          <v-list-item-icon><v-icon>{{ link.icon }}</v-icon></v-list-item-icon>
          <v-list-item-content>{{ link.name }}</v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import beforeMount from "@/util/beforeMount";
beforeMount()

import WebContent from '@/content.json'

let content = WebContent.nav[localStorage.getItem('language')]
let links = content.list;

export default {
  name: "Navbar",
  data: () => ({
    mobileNav: false,
    links,
    content,
    loadingUser: Boolean(localStorage.getItem('token')),
    location: window.location.origin
  }),
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  methods: {
    translate() {
      localStorage.setItem('language', localStorage.getItem('language') === 'ru' ? 'en' : 'ru')
      window.location.reload()
    }
  },
  async mounted() {
    if(localStorage.getItem('token')) {
      this.loadingUser = true;
      await this.$store.dispatch('getUser').catch(() => {})
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
  .mobileNav {
    display: block;
  }
}
@media screen and (min-width: 1000px) {
  #nav-menu {
    display: none;
  }
  #nav-links {
    display: block;
  }
  .mobileNav {
    display: none;
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
.mobileNav {
  box-shadow: 0 0 10px var(--v-blockShadow-base)!important;
}
.main-icon {
  float: right;
  width: 52px;
  height: 30px;
  transition-duration: 200ms;
}

.main-icon:active {
  opacity: 0.7;
  transition-duration: 200ms;
}

.nav-icon {
  margin-right: 3px;
}

.user-avatar {
  margin-right: 5px;
  width: 40px;
  height: 40px;
}
</style>