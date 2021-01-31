import config from '@/config.json'
import Cookies from "@/util/cookies";

export default {
    actions: {
        async getGuild(ctx, id) {
            return new Promise(async (resolve, reject) => {
                let cookies = Cookies.parse()
                let response = await fetch(`${config.API}/private/guild/${id}/info`, {headers: {
                    Authorization: cookies.token
                }})
                let body = await response.json()
                if(response.ok) {
                    ctx.commit('addGuild', body)
                    resolve(body)
                }
                else reject(body)
            })
        },
        async updateGuild(ctx, id) {
            return new Promise(async (resolve, reject) => {
                let cookies = Cookies.parse()
                let response = await fetch(`${config.API}/private/guild/${id}/info`, {headers: {
                        Authorization: cookies.token
                    }})
                let body = await response.json()
                if(response.ok) {
                    ctx.commit('updateGuild', body)
                    resolve(body)
                }
                else reject(body)
            })
        }
    },
    mutations: {
        addGuild(state, guild) {
            state.guilds.push(guild)
        },
        updateGuild(state, guild) {
            state.guilds.splice(state.guilds.indexOf(guild), 1)
            state.guilds.push(guild)
        }
    },
    state: {
        guilds: []
    },
    getters: {
        guilds(state) {
            return state.guilds
        }
    }
}