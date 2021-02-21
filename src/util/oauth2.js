import config from '@/config.json'
import Cookies from "@/util/cookies";

export default {
    async getUser(token) {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(`${config.DiscordAPI}/users/@me`, {headers: {
                Authorization: `Bearer ${token}`
            }})
            let body = await response.json()
            if(response.ok) resolve(body)
            else reject(body)
        })
    },
    async getAccessToken(code) {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(`${config.API}/oauth2/token?code=${code}`)
            let body = await response.json()
            if(response.ok) {
                Cookies.set('token', body.accessToken)
                Cookies.set('refreshToken', body.refreshToken)
                resolve(body)
            }
            else reject(body)
        })
    },
    async refreshToken(refreshToken) {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(`${config.API}/oauth2/token/refresh?refreshToken=${refreshToken}`)
            let body = await response.json()
            if(response.ok) {
                Cookies.set('token', body.accessToken)
                Cookies.set('refreshToken', body.refreshToken)
                resolve(body)
            }
            else reject(body)
        })
    }
}