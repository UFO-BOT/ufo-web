export default {
    channels(channels, none = true) {
        let newChannels = []
        if(none) newChannels.push({
            value: 'none',
            text: '-'
        })
        channels.forEach(channel => {
            newChannels.push({
                value: channel.id,
                text: channel.name
            })
        })
        return newChannels
    },
    roles(roles, none = true) {
        let newRoles = []
        if(none) newRoles.push({
            value: 'none',
            text: '-'
        })
        roles.forEach(role => {
            newRoles.push({
                value: role.id,
                text: role.name
            })
        })
        return newRoles
    }
}