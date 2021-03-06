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
                block: '#181a2b',
                blockShadow: '#05050c',
                background: '#0e0f1c',
                code: '#efefef',
                navbar: '#14152a',
                footer: '#14152a',
                mobileNav: '#191b31',
                modal: '#16182a',
                modalHeader: '#232740',
                boostTab: '#0040ff',
                opacityColor: '#adadaf',
                footerLink: '#e3e3e3',
                scrollbarTrack: '#151926',
                scrollbarThumb: '#242940',
                primary: '#6161fd',
                secondary: '#232939'
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
