import Oauth2 from "@/util/oauth2";
import Cookies from "@/util/cookies";
import config from '@/config.json'
import UserAvatar from "@/util/userAvatar";

export default {
    actions: {
        async getUser(ctx) {
            return new Promise(async (resolve, reject) => {
                let cookies = Cookies.parse()
                let token = cookies.token;
                if (Date.now() > Number(cookies.tokenExpiresTimestamp) && cookies.refreshToken) {
                    let response = await Oauth2.refreshToken(cookies.refreshToken).catch(() => {
                    })
                    token = response.accessToken;
                }
                if (token) {
                    Oauth2.getUser(token).then(async user => {
                        user.tag = user.username + '#' + user.discriminator
                        user.avatarURL = UserAvatar(user)
                        ctx.commit('updateUser', user)
                        resolve(user)
                    }).catch(err => reject(err))
                }
            })
        },
        async getUserBadges(ctx) {
            return new Promise(async (resolve, reject) => {
                let user = ctx.getters.user;
                let cookies = Cookies.parse()
                let token = cookies.token;
                let responseBadges = await fetch(`${config.API}/private/badges`, {headers: {
                        Authorization: token
                    }})
                let badges = await responseBadges.json()
                ctx.commit('updateBadges', badges)
                resolve(badges)
            })
        }
    },
    mutations: {
        updateUser(state, user) {
            state.user = user
        },
        updateBadges(state, badges) {
            state.badges = badges
        }
    },
    state: {
        user: {},
        badges: []
    },
    getters: {
        user(state) {
            return state.user
        },
        badges(state) {
            return state.badges
        }
    }
}