<template>
  <div>
    <v-footer color="footer" class="footer" padless dark>
      <div class="footer-flex pa-4">
        <div class="footer-block">
          <div class="bot-name">
            <img src="@/assets/logo.png" alt="UFO Logo" class="main-icon"/>UFO
          </div>
        </div>
        <div class="links-flex">
          <div class="footer-block" v-for="block of links">
            <div v-for="link of block">
              <a v-if="link.blank" class="footer-link" target="_blank" :href="link.path">{{ link.name }}</a>
              <router-link v-else class="footer-link" :to="link.path">{{ link.name }}</router-link>
            </div>
          </div>
        </div>
        <div class="footer-block">
          <v-switch v-model="dark" :label="content.darkTheme" @change="updateTheme" hide-details></v-switch>
        </div>
      </div>
      <div class="footer-bottom">
        <v-divider/>
        <div class="ma-2">{{ content.copyright.replace('{year}', year) }}</div>
      </div>
    </v-footer>
  </div>
</template>

<script>
import WebContent from '@/content.json'

let content = WebContent.footer[localStorage.getItem('language')]
let links = content.list;

export default {
  name: "Footer",
  data: () => ({
    content,
    links,
    year: new Date().getFullYear(),
    dark: localStorage.getItem('theme') === 'dark'
  }),
  methods: {
    updateTheme() {
      if(this.dark) localStorage.setItem('theme', 'dark')
      else localStorage.setItem('theme', 'light')
      this.$vuetify.theme.dark = this.dark;
    }
  }
}
</script>

<style scoped>
.footer {
  box-shadow: 0 0 10px var(--v-blockShadow-base)!important;
  margin-top: 20px;
}
.footer-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.links-flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
.main-icon {
  width: 50px;
  height: 27px;
  display: inline;
  margin-right: 5px;
}
.bot-name {
  font-size: 2em;
  font-weight: bold;
}
.footer-block {
  margin: 5px 30px;
}
.footer-link {
  text-decoration: none;
  color: var(--v-footerLink-base);
  transition-duration: 200ms;
}
.footer-link:active {
  opacity: 0.7;
  transition-duration: 200ms;
}
.footer-bottom {
  text-align: center;
  width: 100%;
}
</style>