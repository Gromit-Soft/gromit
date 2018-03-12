/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2016 NetIQ Corporation, a Micro Focus company
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
     * This value controles if gromit will add CSS to the project or not.
     */
    addCSS: true,

    /**
     * @private
     */
    init: function() {
        if (gromit.bestLocale) {
            
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
             * We want to specify the formats for the short dates in US English
             * so they don't have the starting zero.
             */
            if (gromit.bestLocale.toLowerCase() === 'en' || gromit.bestLocale.toLowerCase() === 'en_us') {
                moment.updateLocale('en', {
                    longDateFormat: {
                        L: 'M/D/YYYY',
                        LLLL: 'ddd MMMM D YYYY LT'
                    }
                });
            }
        }

        var localeData = moment.localeData();

        gromit.token = $.cookie('gromitTokenCookie');
        gromit.tokenType = $.cookie('gromitTokenTypeCookie');

        if (gromit.addCSS) {
            if (gromit.debugMode) {
                gromit.addCSSLink('gromit/css/humanMsg.css');
                gromit.addCSSLink('gromit/css/reset.css');
                gromit.addCSSLink('gromit/css/coreui.css');
            } else {
                gromit.addCSSLink('gromit/css/gromit-all-min.css');
            }
        }

        gromit.isiPad = navigator.userAgent.match(/iPad/i) !== null;
        
        /*
         * If the current browser supports canvas then we'll import paper.
         */
        if (gromit.isCanvasSupported()) {
            gromit.hasCanvas = true;
        } else {
            gromit.hasCanvas = false;
        }
    }
};

angular.module('gromitsoft', []);