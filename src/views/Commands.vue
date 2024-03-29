<template>
  <div style="text-align: -webkit-center">
    <div class="name"><b>{{ content.name }}</b></div>
    <v-progress-circular v-if="loading" :size="60" width="5" indeterminate></v-progress-circular>
    <v-expansion-panels v-else class="commands" accordion focusable>
      <v-expansion-panel
          v-for="(category, i) of categories"
          :key="i"
      >
        <v-expansion-panel-header class="category" color="block" ripple v-if="commands.find(c => c.category.en === category)"><span><v-icon x-large left>{{ icons[i] }}</v-icon>{{commands.find(c => c.category.en === category).category[language]}}</span></v-expansion-panel-header>
        <v-expansion-panel-content color="block">
          <div v-for="(cmd, j) of commands.filter(c => c.category.en === category)">
            <div class="command">
              <div>{{cmd.name[language]}}</div>
              <v-dialog v-model="dialogs[cmd.name.en]" width="500" scrollable>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon large class="info-icon" v-bind="attrs" v-on="on">info</v-icon>
                </template>
                <v-card color="modal">
                  <v-card-title color="modalHeader" class="cmd-name">
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
                    <v-btn text @click="dialogs[cmd.name.en] = false">{{ content.close }}</v-btn>
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
import ParsePerms from "@/util/parsePerms";
import config from '@/config.json';

let content = WebContent.commands[localStorage.getItem('language')]

export default {
  name: "Commands",
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    language: localStorage.getItem('language'),
    loading: true,
    commands: [],
    dialogs: {},
    categories: ['General', 'Economy', 'Games', 'Utilities', 'Moderation'],
    icons: ['public', 'attach_money', 'phone_iphone', 'build', 'security'],
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
  font-size: 1.9em;
  padding: 26px 26px!important;
}
.commands {
  max-width: 1000px;
  width: auto;
  padding-left: 15px;
  padding-right: 15px;
}
.command {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 1.4em;
  margin-top: 5px;
  margin-bottom: 5px;
  word-break: break-all;
}
.info-icon {
  cursor: pointer;
}
.cmd-name {
  font-size: 1.4em!important;
  background-color: var(--v-modalHeader-base);
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