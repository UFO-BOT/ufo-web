export default {
    channels(channels, {none = true, checkMemberManageable = true, checkBotManageable = true} = {}) {
        let newChannels = []
        if(none) newChannels.push({
            value: 'none',
            text: '-'
        })
        channels.forEach(channel => {
            if((checkMemberManageable ? channel.memberManageable : true)
                && (checkBotManageable ? channel.botManageable : true)) newChannels.push({
                value: channel.id,
                text: channel.name
            })
        })
        return newChannels
    },
    roles(roles, {none = false, checkMemberManageable = true, checkBotManageable = true} = {}) {
        let newRoles = []
        roles.forEach(role => {
            newRoles.push({
                value: role.id,
                text: role.name,
                disabled: (checkMemberManageable ? !role.memberManageable : false)
                    || (checkBotManageable ? !role.botManageable : false)
            })
        })
        if(none) newRoles.push({
            value: 'none',
            text: '-'
        })
        return newRoles
    }
}