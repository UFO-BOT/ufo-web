<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>{{ content.name }}</b></div>
    <v-progress-circular v-if="loading" :size="60" width="5" color="white" indeterminate></v-progress-circular>
    <v-expansion-panels v-else class="commands" accordion focusable>
      <v-expansion-panel
          v-for="(category, i) of categories"
          :key="i"
      >
        <v-expansion-panel-header class="category" ripple v-if="commands.find(c => c.category.en === category)"><span><v-icon x-large left>{{ icons[i] }}</v-icon>{{commands.find(c => c.category.en === category).category[language]}}</span></v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(cmd, j) of commands.filter(c => c.category.en === category)">
            <div class="command">
              <div>{{cmd.name[language]}}</div>
              <v-dialog v-model="dialogs[cmd.name.en]" width="500" scrollable persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon x-large class="info-icon" v-bind="attrs" v-on="on">info</v-icon>
                </template>
                <v-card>
                  <v-card-title class="grey darken-3 cmd-name">
                    {{ cmd.name[language].toUpperCase() }}
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon class="ml-2" v-bind="attrs" v-on="on" v-if="cmd.boostRequired"><v-icon color="#7777ff">favorite</v-icon></v-btn>
                      </template>
                      <span>{{ content.boostRequired }}</span>
                    </v-tooltip>
                  </v-card-title>

                  <v-card-text class="cmd-info">
                    <div class="info-title">{{ content.description }}</div>
                    <div v-html="cmd.description[language]"></div>
                    <div class="info-title">{{ content.usage }}</div>
                    <div><code>{{ cmd.usage[language] }}</code></div>
                    <div class="info-title">{{ content.aliases }}</div>
                    <div><v-chip v-for="a in cmd.aliases[language]" ripple color="secondary" class="alias cmd-chip">{{ a }}</v-chip></div>
                    <div v-if="cmd.permissions.length">
                      <div class="info-title">{{ content.permissions }}</div>
                      <div v-html="ParsePerms(cmd.permissions, language).join(', ')"></div>
                    </div>
                  </v-card-text>

                  <v-divider class="blue-grey darken-3"></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="white" text @click="dialogs[cmd.name.en] = false">{{ content.close }}</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
            <v-divider v-if="j < commands.filter(c => c.category.en === category).length-1"></v-divider>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import ParsePerms from "@/util/parsePerms";
import config from '@/config.json';

let cookies = Cookies.parse()
let content = WebContent.commands[cookies.language]

export default {
  name: "Commands",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    language: cookies.language,
    loading: true,
    commands: [],
    dialogs: {},
    categories: ['General', 'Economy', 'Games', 'Utilities', 'Moderation', 'Settings'],
    icons: ['public', 'attach_money', 'phone_iphone', 'build', 'security', 'settings'],
    ParsePerms
  }),
  async mounted() {
    let commands = await fetch(`${config.API}/public/commands`)
    this.commands = await commands.json()
    this.loading = false;
  }
}
</script>

<style scoped>
.name {
  margin: 7px 0 12px 0;
  font-size: 2.5em;
}
.category {
  font-size: 2em;
  padding: 26px 26px!important;
}
.commands {
  width: 95%;
  border-radius: 5px;
}
.command {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.5em;
  margin-top: 5px;
  margin-bottom: 5px;
  word-break: break-all;
}
.info-icon {
  cursor: pointer;
}
.cmd-name {
  font-size: 1.4em!important;
}
.cmd-info {
  padding-top: 10px!important;
  font-size: 1.5em;
  line-height: 1.2em;
}
.info-title {
  font-weight: bold;
  margin-top: 7px;
  margin-bottom: 5px;
  font-size: 1em;
}
.cmd-chip {
  font-size: 0.7em!important;
}
.alias {
  margin-right: 5px;
}
</style>