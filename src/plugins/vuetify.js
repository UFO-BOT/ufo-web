import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        options: { customProperties: true },
        themes: {
            customProperties: true,
            dark: {
                block: '#232831',
                blockShadow: '#111418',
                background: '#1a1e25',
                code: '#0e1011',
                navbar: '#1f242d',
                mobileNav: '#1f242d',
                modal: '#212328',
                modalHeader: '#33363e',
                boostTab: '#0040ff',
                opacityColor: '#b1b1b1',
                primary: '#7777ff',
                secondary: '#33363e'
            },
            light: {
                block: '#ffffff',
                blockShadow: '#909090',
                background: '#f6f6f6',
                code: '#eaeaea',
                navbar: '#7777ff',
                mobileNav: '#ffffff',
                modal: '#ffffff',
                modalHeader: '#adbdc4',
                boostTab: '#0040ff',
                opacityColor: '#909090',
                primary: '#7777ff',
                secondary: '#546E7A'
            }
        }
    },
});
