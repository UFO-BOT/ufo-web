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
        let themes = ['light', 'dark'];
        let language = cookies.language;
        let theme = cookies.theme;
        if(!languages.includes(language)) {
            document.cookie = 'language=en';
            cookies.language = 'en';
        }
        if(!themes.includes(theme)) {
            document.cookie = 'theme=dark';
            cookies.theme = 'dark';
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