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
                        let responseBadges = await fetch(`${config.API}/private/badges`, {headers: {
                            Authorization: token
                        }})
                        let badges = await responseBadges.json()
                        if(responseBadges.ok) user.badges = badges
                        ctx.commit('updateUser', user)
                        resolve(user)
                    }).catch(err => reject(err))
                }
            })
        }
    },
    mutations: {
        updateUser(state, user) {
            state.user = user
        }
    },
    state: {
        user: {}
    },
    getters: {
        user(state) {
            return state.user
        }
    }
}