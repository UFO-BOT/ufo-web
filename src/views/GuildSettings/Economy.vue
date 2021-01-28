<template>
  <div>

  </div>
</template>

<script>
import WebContent from '@/content.json'
import Cookies from '@/util/Cookies'

let cookies = Cookies.parse()
let content = WebContent.GuildGeneral[cookies.language]

export default {
  name: 'Home',
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