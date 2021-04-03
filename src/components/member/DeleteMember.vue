<template>
  <div>
    <v-dialog v-model="dialog" width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </template>
      <v-card color="modal">
        <v-card-title>{{ content.deleteMember }}</v-card-title>
        <v-card-text
            v-html="content.deleteConfirm.replace('{{member}}', `<code>${member.user.tag}</code>`)">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="deleteMember" :loading="loading" text>
            {{ content.delete }}
          </v-btn>
          <v-btn text :disabled="loading" @click="dialog = false">{{ content.cancel }}</v-btn>
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
let content = WebContent.LeaderboardMember[cookies.language]

export default {
  name: "DeleteMember",
  props: ['member'],
  data: () => ({
    content,
    loading: false,
    dialog: false
  }),
  methods: {
    async deleteMember() {
      this.loading = true
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/balances/${this.member.user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: cookies.token
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