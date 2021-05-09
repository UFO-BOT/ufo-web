import config from '@/config.json'

export default {
    actions: {
        async getGuilds(ctx) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(`${config.API}/private/guilds`, {
                    headers: {
                        Authorization: localStorage.getItem('token')
                    }
                })
                let body = await response.json()
                if(response.ok) {
                    ctx.commit('setGuilds', body)
                    resolve(body)
                }
                else reject(body)
            })
        },
        async getFullGuild(ctx, id) {
            return new Promise(async (resolve, reject) => {
                let response = await fetch(`${config.API}/private/guild/${id}/info`, {headers: {
                    Authorization: localStorage.getItem('token')
                }})
                let body = await response.json()
                if(response.ok) {
                    ctx.commit('addFullGuild', body)
                    resolve(body)
                }
                else reject(body)
            })
        },
        clearGuilds(ctx) {
            ctx.commit('clearGuilds')
        }
    },
    mutations: {
        addFullGuild(state, guild) {
            state.fullGuilds.push(guild)
        },
        setGuilds(state, guilds) {
            state.guilds = guilds;
        },
        clearGuilds(state) {
            state.fullGuilds = []
            state.guilds = []
        }
    },
    state: {
        fullGuilds: [],
        guilds: []
    },
    getters: {
        guilds(state) {
            return state.guilds
        },
        fullGuilds(state) {
            return state.fullGuilds
        }
    }
}