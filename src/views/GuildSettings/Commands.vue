<template>
  <div>
    <div style="text-align: -webkit-center" v-if="loading">
      <v-progress-circular :size="60" :width="5"
                           indeterminate></v-progress-circular>
    </div>
    <v-form ref="form" v-if="!loading">
      <v-expansion-panels class="commands" accordion :focusable="!categorySettingsHover">
        <v-expansion-panel
            v-for="(category, i) of categories"
            :key="i"
            :readonly="categorySettingsHover"
        >
          <v-expansion-panel-header class="category" color="block" :ripple="!categorySettingsHover" v-if="commands.find(c => c.category.en === category)"><span><v-icon large left>{{ icons[i] }}</v-icon>{{commands.find(c => c.category.en === category).category[language]}}</span>
            <template v-slot:actions>
              <Category :category="commands.find(c => c.category.en === category).category[language]" :name="category" @updated="categoryUpdated"></Category>
              <v-icon>$expand</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content color="block">
            <div v-for="(cmd, i) of commands.filter(c => c.category.en === category)">
              <div class="command">
                <div class="cmd-name">{{settings.prefix + cmd.name[settings.language.commands]}}</div>
                <div style="float: right">
                  <Command :command="settings.prefix + cmd.name[settings.language.commands]" :name="cmd.name.en" :settings="settings.commands[cmd.name.en]"></Command>
                </div>
              </div>
              <v-divider v-if="i < commands.filter(c => c.category.en === category).length-1"></v-divider>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from "@/config.json";

import Command from "@/components/Command";
import Category from "@/components/Category";

let cookies = Cookies.parse()
let content = WebContent.GuildCommands[cookies.language]

export default {
  name: 'Commands',
  components: {
    Category,
    Command
  },
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    language: cookies.language,
    loading: true,
    settings: {
      commands: {}
    },
    rules: {
    },
    commands: [],
    categories: ['General', 'Economy', 'Games', 'Utilities', 'Moderation'],
    icons: ['public', 'attach_money', 'phone_iphone', 'build', 'security'],
    categorySettingsHover: false,
    submitting: false
  }),
  methods: {
    categoryUpdated(category, settings) {
      this.commands.filter(cmd => cmd.category.en === category).forEach(cmd => {
        this.settings.commands[cmd.name.en] = {
          name: cmd.name.en,
          enabled: settings.enabled,
          deleteUsage: settings.deleteUsage,
          allowedRoles: settings.allowedRoles,
          forbiddenRoles: settings.forbiddenRoles,
          allowedChannels: settings.allowedChannels,
          forbiddenChannels: settings.forbiddenChannels
        };
      })
    }
  },
  async mounted() {
    let commands = await fetch(`${config.API}/public/commands`)
    this.commands = await commands.json()
    let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/settings`, {headers: {
        Authorization: cookies.token
      }})
    let body = await response.json()
    if(!response.ok) return window.location.replace('/@me');
    this.settings = body;
    this.loading = false;
  }
}
</script>

<style scoped>
.category {
  font-size:  1.5em;
  padding: 26px 26px!important;
}
.commands {
  width: 95%;
}
.command {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.2em;
  margin-top: 8px;
  margin-bottom: 5px;
  word-break: break-all;
}
.cmd-name {
  font-size: 1.1em;
}
</style>