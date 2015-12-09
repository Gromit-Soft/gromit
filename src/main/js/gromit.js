/*******************************************************************************
 * 
 * Copyright 2015 Gromit Soft Team   
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 ******************************************************************************/
 'use strict';

/*
 * This is a utility object which we can use to hold window level
 * variables and utility functions
 */
/*global gromit:true */
var gromit = {

    /**
     * This will be the localization object set up by the localization service.
     * It can be used to access localized strings from JavaScript.
     */
    i18n: null,

    noFeedback: 'none',
    errorFeedback: 'error',
    validFeedback: 'valid',
    warningFeedback: 'warning',

    /**
     * This is a map for holding localized strings for the MarkdownEditor. 
     */
    MARKDOWN_STRINGS: {},

    /**
     * @private
     */
    addWideStyle: function() {
        if ($(window).width() >= 1400 &&
            !gromit.wideCSS) {
            gromit.wideCSS = gromit.addCSSLink('css/uncompressed_css/client.wide.css');
            return;
        }

        if (gromit.wideCSS &&
            $(window).width() <= 1400) {
            gromit.wideCSS.remove();
            delete gromit.wideCSS;
        }
    },

    /**
     * Setup the markdown control
     */
    setupMarkdown: function() {
        if (gromit.MARKDOWN_CONVERTER) {
            return;
        }
        /*
         * Create a common markdown converter with any sanitizing hooks we want.
         * We using the page down Markdown.Sanitizer which has two hooks:
         * One of them sanitizes the output HTML to only include a list of whitelisted HTML tags.
         * The other one attempts to balance opening/closing tags to prevent leaking formating
         * if the HTML is displayed in the browser.
         * We are adding a hook to prevent <img[^>]+> tags in the output.
         */
        gromit.MARKDOWN_CONVERTER = Markdown.getSanitizingConverter();
        // remove image tags
        gromit.MARKDOWN_CONVERTER.hooks.chain('postConversion', function(text) {
            return text.replace(/<img[^>]+>/, '');
        });
    },

    /**
     * Add the Medium stylesheet to the page if the window width is less than 1024
     */
    addMediumStyle: function() {
        if (!gromit.mediumCSS &&
            $(window).width() <= 1024) {
            gromit.mediumCSS = gromit.addCSSLink('css/uncompressed_css/client.medium.css');
            return;
        }

        if (gromit.mediumCSS &&
            $(window).width() > 1024) {
            gromit.mediumCSS.remove();
            gromit.mediumCSS = null;
        }
    },

    /**
     * Add the narrow stylesheet to the page if the window width as narrow as the phone size
     */
    addNarrowStyle: function() {
        if (!gromit.narrowCSS &&
            $(window).width() < 768) {
            gromit.narrowCSS = gromit.addCSSLink('css/uncompressed_css/client.narrow.css');
            return;
        }

        if (gromit.narrowCSS &&
            $(window).width() >= 768) {
            gromit.narrowCSS.remove();
            gromit.narrowCSS = null;
        }
    },

    /**
     * @private
     */
    updateStyles: function() {
        gromit.addWideStyle();
    },

    /**
     * @private
     */
    init: function() {
        if (gromit.bestLocale.indexOf('_#') !== -1) {
            /*
             * This means that the browser determined one of the new compound
             * locales.  However, the moment library doesn't support those yet.
             * That means we need to strip off the last part.
             */
            gromit.bestLocale = gromit.bestLocale.substring(0, gromit.bestLocale.indexOf('_#'));
        }

        moment.locale(gromit.bestLocale);

        /* 
         * We want to specify the formats for the short dates in English
         * so they don't have the starting zero.
         */
        if (gromit.bestLocale.indexOf('en') === 0) {
            moment.locale('en', {
                longDateFormat: {
                    L: 'M/D/YYYY',
                    LT: 'h:mm A',
                    LL : 'MMMM Do YYYY',
                    LLLL: 'ddd MMMM D YYYY LT'
                }
            });
        }

        var localeData = moment.localeData();

        define('jquery', [], function() {
            return jQuery;
        });

        gromit.token = $.cookie('gromitTokenCookie');
        gromit.tokenType = $.cookie('gromitTokenTypeCookie');

        /*
         * Add css lib
         */
        gromit.addCSSLink('css/lib/bootstrap.min.css');
        gromit.addCSSLink('css/lib/ng-tags-input.min.css');

        if (gromit.debugMode) {
            gromit.addCSSLink('css/humanMsg.css');
            gromit.addCSSLink('css/reset.css');
            gromit.addCSSLink('css/coreui.css');
            gromit.addCSSLink('css/client.css');
            gromit.addCSSLink('css/tableWidget.css');
            gromit.addCSSLink('css/pageControls.css');
            gromit.addCSSLink('css/review.css');
            gromit.addCSSLink('css/reviewList.css');
            gromit.addCSSLink('css/nav.css');
            gromit.addCSSLink('css/overview.css');
            gromit.addCSSLink('css/collection.css');
            gromit.addCSSLink('css/catalog.css');
            gromit.addCSSLink('css/header.css');
            gromit.addCSSLink('css/markdown.css');
            gromit.addCSSLink('css/riskCoverage.css');
            gromit.addCSSLink('css/settings.css');
            gromit.addCSSLink('css/group.css');
            gromit.addCSSLink('css/perm.css');
            gromit.addCSSLink('css/vis.css');
            gromit.addCSSLink('css/rolePolicy.css');
            gromit.addCSSLink('css/fulfillment.css');
            gromit.addCSSLink('css/advisorFeeds.css');
        } else {
            gromit.addCSSLink('css/gromit-all-min.css');
        }

        gromit.isiPad = navigator.userAgent.match(/iPad/i) !== null;

        /*
         * Almost all of our CSS is in coreui.css, but there are always a few
         * tweaks you need to add for IE. This special style sheet is added only
         * if the browser is IE and contains just those tweaks.
         */
        var browserType = navigator.userAgent.toLowerCase();
        if (browserType.indexOf('msie') > -1 || browserType.match(/trident.+rv:11./)) {
            gromit.addCSSLink('css/uncompressed_css/msie.css');
        } else if (browserType.indexOf('chrome') > -1) {
            gromit.addCSSLink('css/uncompressed_css/webkit.css');
        } else if (browserType.indexOf('safari') > -1) {
            gromit.addCSSLink('css/uncompressed_css/safari.css');
        } else if (browserType.indexOf('firefox') > -1) {
            gromit.addCSSLink('css/uncompressed_css/firefox.css');
        } 

        if (gromit.isiPad) {
            gromit.addCSSLink('css/uncompressed_css/ipad.css');
        }

        gromit.addCSSLink('custom/custom.css');

        gromit.addMediumStyle();
        gromit.addNarrowStyle();

        $(window).resize(function() {
            gromit.addMediumStyle();
            gromit.addNarrowStyle();
        });

        /*
         * If the current browser supports canvas then we'll import paper.
         */
        if (gromit.isCanvasSupported()) {
            gromit.hasCanvas = true;
        } else {
            gromit.hasCanvas = false;
        }

        /*
         * If the current browser is an iPad then we'll load the script to
         * enable touch events for JQuery sortable.
         */

        if (gromit.isiPad) {
            require(['js/lib/jquery.ui.touch-punch.js'], function() {});
        }

        gromit.updateStyles();

        $(window).resize(function() {
            gromit.updateStyles();
        });
    }

};