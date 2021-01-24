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
        <v-btn text @click="translate()"><img alt="Translate" src="../assets/translate.png" class="translate"></v-btn>
        <v-btn v-for="link of rightLinks" text :to="!link.href ? link.path : ''" :href="link.href ? link.path : ''" :target="link.blank ? '_blank' : '_self'">{{ link.name }}</v-btn>
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
let cookies = Cookies.parse()
import content from '@/content.json'
let links = content.nav[cookies.language].list.filter(link => !link.right)
let rightLinks = content.nav[cookies.language].list.filter(link => link.right)

export default {
  name: "Navbar",
  data: () => ({
    mobileNav: false,
    links: links,
    rightLinks: rightLinks,
    translate: () => {
      Cookies.set('language', cookies.language === 'ru' ? 'en' : 'ru', 1e15)
      window.location.reload()
    }
  }),
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
.translate {
  width: 30px;
  height: 30px;
}
</style>