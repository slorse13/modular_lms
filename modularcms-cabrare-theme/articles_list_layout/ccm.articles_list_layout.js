/**
 * @overview ccm component for the articles list layout
 * @author Felix Bröhl <broehl@everoo.io> 2020
 * @license The MIT License (MIT)
 */

( () => {

    const component = {

        name: 'articles_list_layout',

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-25.5.3.min.js',

        config: {
            "helper": [ "ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-5.1.0.mjs" ],
            "html": [ "ccm.load", "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/articles_list_layout/resources/html/template.html" ],
            "css": ["ccm.load",
                "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/cabrare_theme/resources/css/global.css",
                "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/articles_list_layout/resources/css/style.css"
            ],
            "routing_sensor": ["ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/routing_sensor/versions/ccm.routing_sensor-1.0.0.js"],
            "data_controller": [ "ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/data_controller/versions/ccm.data_controller-1.0.0.min.js" ],
            "core": [ "ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/theme_component_core/versions/ccm.theme_component_core-1.0.0.min.js" ],
            "readNowText": "Read now",
            "emptyText": "There are currently no articles to list here"
        },

        Instance: function () {
            let $;

            this.ready = async () => {
                $ = Object.assign( {}, this.ccm.helper, this.helper );                 // set shortcut to help functions
            };

            this.start = async () => {
                this.core.initContent(this.html.main);
                this.showArticles();
            };

            this.update = (key, value) => {
                this[key] = value;
            };

            this.updateChildren = async () => {
                this.core.updateContent();
                this.showArticles();
            };

            this.showArticles = async () => {
                let list = this.element.querySelector('#page-children-list');
                $.setContent(list, $.loading());
                let pageUrl = await this.data_controller.getFullPageUrl(this.websiteKey, this.page.pageKey);
                if (pageUrl == '/') {
                    pageUrl = '';
                }
                let children = await this.data_controller.getPageChildren(this.websiteKey, this.page.pageKey);
                children.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                if (children.length == 0) {
                    $.setContent(list, this.emptyText);
                } else {
                    list.innerHTML = '';
                    for (let child of children) {
                        let item = $.html(this.html.item, {
                            url: pageUrl + child.urlPart,
                            title: child.title,
                            description: this.truncate(child.meta.description, 1000),
                            readNowText: this.readNowText
                        });
                        $.append(list, item);
                    }
                }

            };

            // copied from https://stackoverflow.com/a/1199420
            this.truncate = (str, n) =>{
                return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str;
            };
        }

    };

    let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();