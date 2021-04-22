<template>
  <div>
    <v-dialog v-model="dialog" width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </template>
      <v-card color="modal">
        <v-card-title>{{ content.subtitles.deleteItem }}</v-card-title>
        <v-card-text
            v-html="content.subtitles.deleteConfirm.replace('{{item}}', `<code>${item.name}</code>`)">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="deleteItem" :loading="loading" text>
            {{ content.subtitles.delete }}
          </v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ content.subtitles.cancel }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import config from "@/config.json";

let content = WebContent.GuildEconomy[localStorage.getItem('language')]

export default {
  name: "DeleteItem",
  props: ['item'],
  data: () => ({
    content,
    loading: false,
    dialog: false
  }),
  methods: {
    async deleteItem() {
      let item = this.item;
      this.loading = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/items/${encodeURIComponent(item.name)}`, {
        method: 'DELETE',
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      if (response.ok) {
        this.dialog = false;
        this.$emit('deleted')
      }
      this.loading = false;
    }
  }
}
</script>

<style scoped>
</style>