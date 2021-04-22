import Oauth2 from "@/util/oauth2";
import config from '@/config.json'
import UserAvatar from "@/util/userAvatar";

export default {
    actions: {
        async getUser(ctx) {
            return new Promise(async (resolve) => {
                let token = localStorage.getItem('token');
                if (!token) return;
                Oauth2.getUser(token).then(async user => {
                    user.tag = user.username + '#' + user.discriminator
                    user.avatarURL = UserAvatar(user)
                    ctx.commit('updateUser', user)
                    resolve(user)
                }).catch(async () => {
                    let refreshToken = localStorage.getItem('refreshToken');
                    if(!refreshToken) return;
                    let response = await Oauth2.refreshToken(localStorage.getItem('refreshToken')).catch(() => {
                    })
                    if(response) {
                        token = response.accessToken;
                        let newUser = await Oauth2.getUser(token).catch(() => {})
                        newUser.tag = newUser.username + '#' + newUser.discriminator
                        newUser.avatarURL = UserAvatar(newUser)
                        window.location.reload()
                    }
                    else resolve()
                })
            })
        },
        async getUserBadges(ctx) {
            return new Promise(async (resolve) => {
                let token = localStorage.getItem('token');
                let responseBadges = await fetch(`${config.API}/private/badges`, {
                    headers: {
                        Authorization: token
                    }
                })
                let badges = await responseBadges.json()
                if(!responseBadges.ok) badges = [];
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