<template>
  <div>

  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/cookies'

let cookies = Cookies.parse()
let content = WebContent.GuildGeneral[cookies.language]

export default {
  name: 'Economy',
  metaInfo: {
    title: content.title
  },
  data: () => ({
    content
  })
}
</script>

<style scoped>

</style>