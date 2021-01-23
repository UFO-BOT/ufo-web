<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>{{ content.name }}</b></div>
    <v-progress-circular v-if="loading" :size="60" width="5" color="white" indeterminate></v-progress-circular>
    <v-expansion-panels class="commands" accordion dark focusable>
      <v-expansion-panel
          v-for="(category, i) of categories"
          :key="i"
      >
        <v-expansion-panel-header color="blue-grey darken-3" class="category" ripple v-if="commands.find(c => c.category.en === category)">{{emojis[i]}} {{commands.find(c => c.category.en === category).category[language]}}</v-expansion-panel-header>
        <v-expansion-panel-content color="blue-grey darken-3">
          <div class="command" v-for="cmd of commands.filter(c => c.category.en === category)">
            <div>{{cmd.name[language]}}</div>
            <v-dialog v-model="dialogs[cmd.name.en]" width="500" dark scrollable persistent>
              <template v-slot:activator="{ on, attrs }">
                <v-icon x-large class="info-icon" v-bind="attrs" v-on="on">info</v-icon>
              </template>
              <v-card>
                <v-card-title class="blue-grey darken-3 cmd-name">
                  {{ cmd.name[language].toUpperCase() }}
                </v-card-title>

                <v-card-text class="blue-grey darken-4 cmd-info">
                  <div class="info-title">{{ content.description }}</div>
                  <div v-html="cmd.description[language]"></div>
                  <div class="info-title">{{ content.usage }}</div>
                  <div v-html="'<code>' + cmd.usage[language].replace(/</gmi, '&lt;').replace(/>/gmi, '&gt;') + '</code>'"></div>
                  <div class="info-title">{{ content.aliases }}</div>
                  <div v-html="cmd.aliases[language].map(a => '<code>' + a + '</code>').join(' ')"></div>
                  <div v-if="cmd.permissions.length">
                    <div class="info-title">{{ content.permissions }}</div>
                    <div v-html="ParsePerms(cmd.permissions, language).join(', ')"></div>
                  </div>
                </v-card-text>

                <v-divider class="blue-grey darken-3"></v-divider>

                <v-card-actions class="blue-grey darken-4">
                  <v-spacer></v-spacer>
                  <v-btn color="white" text @click="dialogs[cmd.name.en] = false">{{ content.close }}</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import Cookies from '@/util/Cookies'
import ParsePerms from "@/util/ParsePerms";
import config from '@/config.json';

let cookies = Cookies.parse()
import content from '@/content.json'

export default {
  name: "Commands",
  data: () => ({
    content: content.commands[cookies.language],
    language: cookies.language,
    loading: true,
    commands: [],
    dialogs: {},
    categories: ['General', 'Economy', 'Games', 'Utilities', 'Moderation', 'Settings'],
    emojis: ['🔰', '💰', '📱', '🔧', '🔨', '⚙'],
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
  color: white;
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
  margin-top: 10px;
  word-break: break-all;
}
.info-icon {
  cursor: pointer;
}
.cmd-name {
  font-size: 1.7em!important;
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
</style>