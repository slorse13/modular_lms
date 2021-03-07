/**
 * @overview ccm component for the menu
 * @author Felix Bröhl <broehl@everoo.io> 2020
 * @author edited by Stefan Lorse <stefan.lorse@smail.inf.h-brs.de> 2021
 * @changes
 * - if page is restricted and user´s role is member then don´t render the page in menu
 * @license The MIT License (MIT)
 */

( () => {

    const component = {

        name: 'menu',

        version: [1,0,0],

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-25.5.3.min.js',

        config: {
            "helper": [ "ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-5.1.0.mjs" ],
            "html": [ "ccm.load", "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/menu/resources/html/template.html" ],
            "css": ["ccm.load",
                "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/cabrare_theme/resources/css/global.css",
                "https://slorse13.github.io/modular_lms/modularcms-cabrare-theme/menu/resources/css/style.css"
            ],
            "routing_sensor": ["ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/routing_sensor/versions/ccm.routing_sensor-1.0.0.js"],
            "data_controller": [ "ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/data_controller/versions/ccm.data_controller-1.0.0.min.js" ],
            "user": [ "ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/user/versions/ccm.user-10.0.0.js" ],
            "edit": false
        },

        Instance: function () {
            let $;

            let _menuItems = [];
            let _startPage = null;
            let _startPageUrl = '';
            let _currentPageUrl = '';

            this.ready = async () => {
                $ = Object.assign( {}, this.ccm.helper, this.helper );                 // set shortcut to help functions
            };

            this.start = async () => {
                await this.initMenuItems();

                $.setContent(this.element, $.html(this.html.main, {}));

                // hamburger button
                const menu = this.element.querySelector('nav');
                const hamburger = this.element.querySelector('#hamburger-button');
                hamburger.onclick = () => {
                    if (hamburger.classList.contains('active')) {
                        menu.classList.remove('active');
                        hamburger.classList.remove('active');
                        hamburger.parentElement.classList.remove('active');
                    } else {
                        menu.classList.add('active');
                        hamburger.classList.add('active');
                        hamburger.parentElement.classList.add('active');
                    }
                };
                menu.addEventListener('click', () => {
                    menu.classList.remove('active');
                    hamburger.classList.remove('active');
                    hamburger.parentElement.classList.remove('active');
                });

                await this.updateChildren();
            };

            this.update = (key, value) => {
                this[key] = value;
            };

            this.updateChildren = async () => {
                _currentPageUrl = window.location.pathname;//await this.data_controller.getFullPageUrl(this.websiteKey, this.page.pageKey);
                let pageUrlSplit = _currentPageUrl.split('/');
                this.element.querySelector('#menu-item-container').innerHTML = '';
                for (let item of _menuItems) {
                    let itemElement = $.html(this.html.menuItem, item);
                    if (item.route.split('/')[1] == pageUrlSplit[1]) { // TODO base url
                        itemElement.classList.add('active');
                    }
                    $.append(this.element.querySelector('#menu-item-container'), itemElement);
                }
            };

            this.initMenuItems = async () => {
                _startPage = await this.data_controller.getPageByUrl(this.websiteKey, '/', !this.edit);
                _startPageUrl = '/';
                // this.addMenuPage(_startPage);
                const pageChildren = await this.data_controller.getPageChildren(this.websiteKey, _startPage.pageKey);
                const userRole = await this.data_controller.getUserWebsiteRole( this.user.getUsername(), this.websiteKey );
                for (let pageChild of pageChildren) {

                   
                    // console.log(pageChild.meta.restrict);
                    // Don´t show Menu-Item if page is restricted
                    if(userRole != "member" || pageChild.meta.restrict==null || !pageChild.meta.restrict){
                        this.addMenuPage(pageChild);

                    }
                }
            };

            this.addMenuPage = (page) => {   
                    _menuItems.push({
                        text: page.title,
                        route: (_startPageUrl == '/' ? '' : _startPageUrl) + page.urlPart
                    });
            };
        }

    };

    let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();