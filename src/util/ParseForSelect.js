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
    }
}