<template>
  <div>
    <v-dialog v-model="dialog" width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="red" class="mt-1" v-bind="attrs" v-on="on">{{ content.subtitles.reset }}</v-btn>
      </template>
      <v-card>
        <v-card-title>{{ content.subtitles.resetBalance }}</v-card-title>
        <v-card-text class="pb-0">
          <div class="attention">{{ content.subtitles.attention }}</div>
          <div>{{ content.subtitles.resetConfirm }}</div>
          <div class="guildName">{{ content.subtitles.enterGuildName }}</div>
          <v-text-field v-model="name" color="red" outlined :placeholder="guild.name" class="mt-1"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="resetBalance" :disabled="name !== guild.name" :loading="loading" text>
            {{ content.subtitles.reset }}
          </v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ content.subtitles.cancel }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from "@/config.json";

let cookies = Cookies.parse()
let content = WebContent.GuildEconomy[cookies.language]

export default {
  name: "ResetBalance",
  props: ['guild'],
  data: () => ({
    content,
    loading: false,
    dialog: false,
    name: '',
  }),
  methods: {
    async resetBalance() {
      this.loading = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/reset`, {
        method: 'POST',
        headers: {
          Authorization: cookies.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          scopes: ['balance']
        })
      })
      if (response.ok) {
        this.dialog = false;
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.attention {
  font-size: 1.1em;
  font-weight: bold;
}
.guildName {
  font-size: 1.1em;
  margin-top: 10px;
  color: white;
}
</style>