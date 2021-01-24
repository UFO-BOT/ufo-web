import config from '@/config.json'
import Cookies from "@/util/Cookies";

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
                Cookies.set('token', body.accessToken, 1e15)
                Cookies.set('refreshToken', body.refreshToken, 1e15)
                Cookies.set('tokenExpiresTimestamp', body.expiresTimestamp, 1e15)
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
                Cookies.set('token', body.accessToken, 1e15)
                Cookies.set('refreshToken', body.refreshToken, 1e15)
                Cookies.set('tokenExpiresTimestamp', body.expiresTimestamp, 1e15)
                resolve(body)
            }
            else reject(body)
        })
    }
}