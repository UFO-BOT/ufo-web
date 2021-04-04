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
          <div class="footer-block">
            <div><router-link class="footer-link" to="/commands">top.gg</router-link></div>
            <div><router-link class="footer-link" to="/commands">SDC</router-link></div>
            <div><router-link class="footer-link" to="/commands">boticord.top</router-link></div>
          </div>
          <div class="footer-block">
            <div><router-link class="footer-link" to="/commands">Команды</router-link></div>
            <div><router-link class="footer-link" to="/commands">Статистика</router-link></div>
            <div><router-link class="footer-link" to="/commands">Донат</router-link></div>
          </div>
          <div class="footer-block">
            <div><router-link class="footer-link" to="/commands">Документация</router-link></div>
            <div><router-link class="footer-link" to="/commands">Сервер поддержки</router-link></div>
          </div>
        </div>
        <div class="footer-block">
          <v-switch v-model="dark" label="Темная тема" :disabled="updatingTheme" @change="updateTheme" hide-details></v-switch>
        </div>
      </div>
      <div class="footer-bottom">
        <v-divider/>
        <div class="ma-2">Smoky Play © {{ new Date().getFullYear() }} | Все права похитили</div>
      </div>
    </v-footer>
  </div>
</template>

<script>
import Cookies from '@/util/cookies'

let cookies = Cookies.parse()

export default {
  name: "Footer",
  data: () => ({
    links: [
      'Home',
      'About Us',
      'Team',
      'Services',
      'Blog',
      'Contact Us',
    ],
    dark: cookies.theme === 'dark',
    updatingTheme: false
  }),
  methods: {
    updateTheme() {
      this.updatingTheme = true;
      if(this.dark) Cookies.set('theme', 'dark')
      else Cookies.set('theme', 'light')
      window.location.reload()
    }
  }
}
</script>

<style scoped>
.footer {
  box-shadow: 0 0 10px var(--v-blockShadow-base)!important;
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