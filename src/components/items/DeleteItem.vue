<template>
  <div>
    <v-dialog v-model="item.deleteDialog" width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon  v-bind="attrs" v-on="on">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{ content.subtitles.deleteItem }}</v-card-title>
        <v-card-text
            v-html="content.subtitles.deleteConfirm.replace('{{item}}', `<code>${item.name}</code>`)">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="deleteItem(item)" :loading="loading" text>
            {{ content.subtitles.delete }}
          </v-btn>
          <v-btn text :disabled="loading" @click="item.deleteDialog = false">{{ content.subtitles.cancel }}</v-btn>
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
  name: "EditItem",
  props: ['item'],
  data: () => ({
    content,
    loading: false,
    dialog: false,
    valid: true
  }),
  methods: {
    async deleteItem(item) {
      this.loading = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items/${encodeURIComponent(item.name)}`, {
        method: 'DELETE',
        headers: {
          Authorization: cookies.token
        }
      })
      this.loading = false;
      if (response.ok) {
        this.dialog = false;
        this.$emit('deleted')
      }
    }
  }
}
</script>

<style scoped>
</style>