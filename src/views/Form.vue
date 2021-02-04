<template>
  <div>
    <v-form ref="form" v-model="valid" class="form">
      <div style="text-align: -webkit-center">
        <v-progress-circular :size="60" :width="5" color="white"
                             indeterminate  v-if="loading"></v-progress-circular>
        <div class="err" v-if="error.length">{{ error }}</div>
      </div>
      <div v-if="!loading && !error.length">
        <div class="name">{{ content[$route.path.split('/').pop()].name }}</div>
        <div class="questions">
          <div v-for="(question, i) of questions">
            <div class="question">{{question}}</div>
            <v-textarea v-model="answers[i]" class="answer" :label="content.answer" :rules="rules.answer" counter="500" filled></v-textarea>
          </div>
        </div>
        <v-btn color="secondary" large class="submit" :loading="submitting" :disabled="!valid" @click="submit">{{ content.submit }}</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'
import config from '@/config.json'

let cookies = Cookies.parse()
let content = WebContent.form[cookies.language]

export default {
  name: 'Form',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content,
    valid: false,
    submitting: false,
    loading: true,
    rules: {
      answer: [
          answer => typeof answer !== 'string' ? true : (answer.trim().length > 0 && answer.trim().length <= 500) || content.errors.invAnswers
      ]
    },
    questions: [],
    answers: [],
    error: ''
  }),
  methods: {
    async submit() {
      this.submitting = true;
      let formType = this.$route.path.split('/').pop();
      let response = await fetch(`${config.API}/private/support/${formType}`, {
        method: 'POST', headers: {
          'Authorization': cookies.token,
          'Content-Type': 'application/json'
        }, body: JSON.stringify({
          answers: this.answers
        })
      })
      this.submitting = false;
      if(response.ok) window.location.replace('/')
    }
  },
  async mounted() {
    this.$refs.form.validate()
    this.loading = true;
    this.error = '';
    let formType = this.$route.path.split('/').pop();
    document.title = content[formType].title
    let isForbidden = await fetch(`${config.API}/private/support/${formType}`, {
      method: 'POST', headers: {
        'Authorization': cookies.token
      }, body: JSON.stringify({})
    })
    let body = await isForbidden.json()
    if (isForbidden.status === 403) {
      if(body.message.includes('already submitted')) this.error = content.errors.alreadySubmitted
      if(body.message.includes('closed')) this.error = content.errors.recruitmentClosed
      if(body.message.includes('not a member')) this.error = content.errors.memberMotFound
      if(body.message.includes('not banned')) this.error = content.errors.notBanned
      return this.loading = false;
    }
    let res = await fetch(`${config.API}/public/support/questions`)
    let questions = await res.json();
    questions[formType][cookies.language].forEach((q, i) => {
      this.answers[i] = ''
    })
    this.questions = questions[formType][cookies.language]
    this.loading = false;
  }
}
</script>

<style scoped>
.form {
  padding: 10px 0 0 20px;
}

.err {
  color: red;
  font-size: 1.6em;
}

.name {
  font-size: 2.5em;
}

.question {
  width: 90%;
  font-size: 1.1em;
  color: #afafaf;
}

.answer {
  width: 90%;
  margin-top: 5px!important;
}

.submit {
  margin: 10px 0 10px 0;
  font-size: 1.1em;
}
</style>