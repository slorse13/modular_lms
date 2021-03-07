/**
 * @overview ccm component for "cabrare" theme
 * @author Felix Bröhl <broehl@everoo.io> 2020
 * @license The MIT License (MIT)
 */

( () => {

    const component = {

        name: 'cabrare_theme',

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-25.5.3.min.js',

        config: {
            "helper": [ "ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-5.1.0.mjs" ],
            "html": [ "ccm.load", "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/cabrare_theme/resources/html/template.html" ],
            "css": ["ccm.load",
                "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/cabrare_theme/resources/css/global.css",
                "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/cabrare_theme/resources/css/style.css",
            ],
            "routing_sensor": ["ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/routing_sensor/versions/ccm.routing_sensor-1.0.0.js"],
            "core": [ "ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/theme_component_core/versions/ccm.theme_component_core-1.0.0.min.js" ],
            "menu": [ "ccm.component", "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/menu/versions/ccm.menu-1.0.0.js" ],
            "showLogo": true,
            "logo": "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/cabrare_theme/resources/img/default-logo.svg",
            "logoTitle": "Cabrare theme by modularcms"
        },

        Instance: function () {
            let $;

            let _menu = false;

            this.ready = async () => {
                $ = Object.assign( {}, this.ccm.helper, this.helper );                 // set shortcut to help functions
            };

            this.start = async () => {
                this.core.initContent(this.html.main, {}, {
                    'logo-wrapper': (this.showLogo === true && this.logo != null) ? $.html(this.html.logo, {
                        logoSrc: this.logo,
                        logoTitle: this.logoTitle
                    }) : null
                });
                _menu = await this.menu.start(Object.assign(this.getMenuConfig(), {root: this.element.querySelector('#menu-wrapper')}));
            };

            this.update = (key, value) => {
                this[key] = value;
            };

            this.getMenuConfig = () => {
                return {
                    websiteKey: this.websiteKey,
                    page: this.page,
                    edit: this.edit
                };
            };

            this.updateChildren = async () => {
                this.core.updateContent();

                Object.assign(_menu, this.getMenuConfig());
                _menu.updateChildren();
            };
        }

    };

    let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();