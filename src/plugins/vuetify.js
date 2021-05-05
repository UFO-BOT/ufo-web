import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

if(!localStorage.getItem('theme')) localStorage.setItem('theme', 'dark')

export default new Vuetify({
    theme: {
        dark: localStorage.getItem('theme') === 'dark',
        options: { customProperties: true },
        themes: {
            customProperties: true,
            dark: {
                block: '#232831',
                blockShadow: '#111418',
                background: '#1a1e25',
                code: '#0e1011',
                navbar: '#1f242d',
                footer: '#1f242d',
                mobileNav: '#262c38',
                modal: '#212328',
                modalHeader: '#33363e',
                boostTab: '#0040ff',
                opacityColor: '#a8a8a8',
                footerLink: '#e3e3e3',
                scrollbarTrack: '#15181d',
                scrollbarThumb: '#0d1013',
                primary: '#6161fd',
                secondary: '#33363e'
            },
            light: {
                block: '#ffffff',
                blockShadow: '#909090',
                background: '#F8F7FF',
                code: '#eaeaea',
                navbar: '#6161fd',
                footer: '#6161fd',
                mobileNav: '#ffffff',
                modal: '#ffffff',
                modalHeader: '#bcc3c7',
                boostTab: '#0040ff',
                opacityColor: '#898989',
                footerLink: '#ffffff',
                scrollbarTrack: '#d0d0d0',
                scrollbarThumb: '#b8b8b8',
                primary: '#6161fd',
                secondary: '#546E7A'
            }
        }
    },
});
