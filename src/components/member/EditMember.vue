<template>
  <div>
    <v-dialog v-model="dialog" width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>edit</v-icon>
        </v-btn>
      </template>
      <v-card color="modal">
        <v-card-title class="modalHeader">
          {{ member.user.tag }}
          <v-spacer/>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="mt-4">
          <v-form v-model="valid">
            <div class="edit-subtitle">{{ content.balance }}</div>
            <v-text-field v-model="updateMember.balance" :label="content.balance" :rules="rules.balance"
                          class="ma-0 pa-0 mt-4"></v-text-field>
            <v-checkbox v-model="updateMember.resetXP" :label="content.resetXP" class="ma-0 pa-0 fit-content"></v-checkbox>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text :loading="loading" :disabled="!valid" @click="editMember">
            {{ content.submit }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import config from "@/config.json";

let content = WebContent.LeaderboardMember[localStorage.getItem('language')]

export default {
  name: "EditMember",
  props: ['member'],
  data: () => ({
    content,
    loading: false,
    dialog: false,
    valid: true,
    rules: {
      balance: [
          balance => (!isNaN(balance) && ! (balance % 1)) || content.errors.invalidBalance
      ]
    },
    updateMember: {
      balance: 0,
      resetXP: false
    }
  }),
  methods: {
    async editMember() {
      this.loading = true;
      let response = await fetch(`${config.API}/private/guild/${this.$route.params.id}/balances/${this.member.user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: cookies.token
        },
        body: JSON.stringify({
          balance: this.updateMember.balance,
          resetXP: this.updateMember.resetXP
        })
      })
      if(response.ok) {
        this.dialog = false;
        this.$emit('edited')
      }
      this.loading = false;
    }
  },
  mounted() {
    this.updateMember.balance = this.member.balance === null ? 'Infinity' : this.member.balance
  }
}
</script>

<style scoped>
.edit-subtitle {
  color: white;
  font-size: 1.4em;
  margin-bottom: 5px;
}
</style>