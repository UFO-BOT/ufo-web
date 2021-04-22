import config from '@/config.json'

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
            let response = await fetch(`${config.API}/oauth2/token`, {method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({code: code})})
            let body = await response.json()
            if(response.ok) {
                localStorage.setItem('token', body.accessToken)
                localStorage.setItem('refreshToken', body.refreshToken)
                resolve(body)
            }
            else reject(body)
        })
    },
    async refreshToken(refreshToken) {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(`${config.API}/oauth2/token/refresh`, {method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({refreshToken: refreshToken})})
            let body = await response.json()
            if(response.ok) {
                localStorage.setItem('token', body.accessToken)
                localStorage.setItem('refreshToken', body.refreshToken)
                resolve(body)
            }
            else reject(body)
        })
    },
    async revokeToken(token) {
        return new Promise(async (resolve, reject) => {
            let response = await fetch(`${config.API}/oauth2/token/revoke`, {method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({token: token})})
            let body = await response.json()
            if(response.ok) {
                localStorage.removeItem('token')
                localStorage.removeItem('refreshToken')
                resolve(body)
            }
            else reject(body)
        })
    }
}