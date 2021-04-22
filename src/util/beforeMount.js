export default () => {
    let cookiesToDelete = ['language', 'refreshToken', 'theme', 'token']
    document.cookie.split('; ').forEach(cookie => {
        if (cookie.trim().length > 0) {
            let cookieSplit = cookie.split('=');
            let cookieParse = {
                name: cookieSplit[0],
                value: cookieSplit.pop()
            }
            if(cookiesToDelete.includes(cookieParse.name)) {
                localStorage.setItem(cookieParse.name, cookieParse.value)
                document.cookie = `${cookieParse.name}= ;max-age=0`
            }
        }
    })

    if (!localStorage.getItem('language')) {
        if(navigator.language === 'ru-RU') {
            localStorage.setItem('language', 'ru')
        }
        else localStorage.setItem('language', 'en')
    }
}