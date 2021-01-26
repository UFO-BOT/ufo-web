export default (user) => {
    if(user.avatar) return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}?size=512`
    else return `https://cdn.discordapp.com/embed/avatars/${user.discriminator%5}.png`
}