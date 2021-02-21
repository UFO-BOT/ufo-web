export default {
    parse: () => {
        let cookies = {}
        document.cookie.split('; ').forEach(cookie => {
            if (cookie.trim().length > 0) {
                let cookieSplit = cookie.split('=');
                cookies[cookieSplit[0]] = cookieSplit.pop();
            }
        })
        let languages = ['ru', 'en'];
        let language = cookies.language;
        if(!languages.includes(language)) {
            document.cookie = 'language=en';
            cookies.language = 'en';
        }
        return cookies
    },
    parseWithoutLang: () => {
        let cookies = {}
        document.cookie.split('; ').forEach(cookie => {
            if (cookie.trim().length > 0) {
                let cookieSplit = cookie.split('=');
                cookies[cookieSplit[0]] = cookieSplit.pop();
            }
        })
        return cookies
    },
    set: (name, value, maxAge = 1e15) => {
        document.cookie = `${name}=${value};max-age=${maxAge};path=/`
    }
}