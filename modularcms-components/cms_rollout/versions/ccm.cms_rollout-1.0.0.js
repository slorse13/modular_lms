/**
 * @overview ccm component for rollout of modularcms pages
 * @author Felix Bröhl <broehl@everoo.io> 2020
 * @author edited by Stefan Lorse <stefan.lorse@smail.inf.h-brs.de> 2021
 * - check for user loged in else show login form
 * - check if user is invited to actual website
 * - check for page restriction
 * @license The MIT License (MIT)
 * @version latest (1.0.0)
 */

( () => {

    const component = {

        name: 'cms_rollout',

        version: [1,0,0],

        ccm: 'https://ccmjs.github.io/ccm/versions/ccm-25.5.3.min.js',

        config: {
            "html": [ "ccm.load", "https://slorse13.github.io/modular_lms/modularcms-components/cms_rollout/resources/html/templates.html" ],
            "css": [ "ccm.load", "https://slorse13.github.io/modular_lms/modularcms-components/cms_rollout/resources/css/style.css" ],
            "helper": ["ccm.load", "https://ccmjs.github.io/akless-components/modules/versions/helper-5.1.0.mjs"],
            "routing": ["ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/routing/versions/ccm.routing-1.0.0.js"],
            "routing_sensor": ["ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/routing_sensor/versions/ccm.routing_sensor-1.0.0.js"],
            "data_controller": ["ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/data_controller/versions/ccm.data_controller-1.0.0.min.js"],
            "page_renderer": ["ccm.component", "https://slorse13.github.io/modular_lms/modularcms-components/page_renderer/versions/ccm.page_renderer-1.0.0.js"],
            "user": [ "ccm.instance", "https://slorse13.github.io/modular_lms/modularcms-components/user/versions/ccm.user-10.0.0.js" ],
        },

        Instance: function () {

            let $;

            this.ready = async () => {
                $ = Object.assign({}, this.ccm.helper, this.helper);                 // set shortcut to help functions
            };

            let currentContent = null;

            let pageRenderer = null;

            /**
             * Component start closure
             * @returns {Promise<void>}
             */
            this.start = async () => {
                const website = await this.data_controller.getWebsiteFromDomain(window.location.hostname);

                if (website != null) {
                // Add base head tag
                let base = document.createElement('base');
                base.setAttribute('href', website.baseUrl);
                document.head.appendChild(base); 
                    
                    await this.routing.navigateRoot(window.location.pathname);
                    // Content only for logged in User visible && invited Users
                    if(this.user && this.user.isLoggedIn()){

                        // filters the joined website of a user and search for actual domain
                        const member_of_actual_website = await this.data_controller.getUserWebsites(
                            this.user.getUsername())
                                .then(result => result
                                    .filter(x => (x.domain == window.location.hostname)));

                        // invidted to actual page?!
                        if( member_of_actual_website.length > 0 ){
                        this.routing.registerRoutingCallback(async (detail) => {
                            // routing entrypoint
                            if (detail.url.indexOf(website.baseUrl) == 0) {
                                const url = detail.url.substring(website.baseUrl.length - 1);

                                // get page 
                                const page = await this.data_controller.getPageByUrl(website.websiteKey, url, true); 
                             
                                if (page != null) {
                                    // if page is restricted  
                                    // console.log(await this.data_controller.getUserWebsiteRole( this.user.getUsername(), website.websiteKey   ));
                                    if(page.meta.restrict == null || !page.meta.restrict || await this.data_controller.getUserWebsiteRole( this.user.getUsername(), website.websiteKey   ) != "member"){
                                            if (currentContent != url) {
                                                currentContent = url;

                                                // Set page title
                                                this.setTitle(page.title)

                                                // Add meta head tags
                                                this.setMeta('description', page.meta.description);
                                                this.setMeta('keywords', page.meta.keywords);
                                                this.setMeta('robots', page.meta.robots ? 'index, follow' : 'noindex, nofollow');

                                                // render page
                                                const config = {
                                                    parent: this,
                                                    websiteKey: website.websiteKey,
                                                    page: page
                                                };

                                                if (pageRenderer == null) {
                                                    $.setContent(this.element, $.html(this.html.main, {}));
                                                    pageRenderer = await this.page_renderer.start(Object.assign(config, {root: this.element.querySelector('#page-renderer-container')}));
                                                } else {
                                                    Object.assign(pageRenderer, config);
                                                    pageRenderer.updateChildren();
                                                }

                                                // Set scrollTop
                                                window.scrollTo(0,0);
                                            }
                                        }else{
                                              // redirect to startpage
                                              alert("This page is restricted!"); 
                                              this.routing.navigateTo('/');
                                                return;
                                        }
                                } else {
                                    // render 404
                                    this.render404();
                                }
                            } else {
                                // render 404
                                this.render404();
                            }
                        }, 'cms_rollout');
                        }else{
                            alert("You are not invited to this Event!");
                            this.user.logout()
                        }
                    }else{
                            // start cms with login form
                            window.location.href =  "/edit";  
                            // this.routing.navigateTo('/login');
                            return; 
                    }
                } else {
                    alert('This site was not registered for modularcms.');
                }
            };

            this.render404 = () => {
                currentContent = null;
                this.setTitle('Page not found.');
                this.setMeta('description', '');
                this.setMeta('keywords', '');
                this.setMeta('robots', 'noindex, nofollow');
                $.setContent(this.element, $.html(this.html.main, {}));
                $.setContent(this.element.querySelector('#page-renderer-container'), $.html(this.html.error404, {}));
            }

            this.setTitle = (title) => {
                let titleElement = document.head.querySelector('title');
                if (titleElement == null) {
                    titleElement = document.createElement('title');
                    document.head.appendChild(titleElement);
                }
                titleElement.innerText = title;
            }

            this.setMeta = (name, content) => {
                let meta = document.head.querySelector('meta[name="' + name + '"]');
                if (meta == null) {
                    meta = document.createElement('meta');
                    document.head.appendChild(meta);
                }
                meta.setAttribute('name', name);
                meta.setAttribute('content', content);
            };
        }
    };

    let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();
