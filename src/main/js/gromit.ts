/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2016 NetIQ Corporation, a Micro Focus company
 *
 ******************************************************************************/
 'use strict';
 
declare var $;
declare var jQuery;
declare var moment;
declare var angular;
declare var require;
declare var _;
declare var humanMsg;

/*
 * This is a utility object which we can use to hold window level
 * variables and utility functions
 */
/*global gromit:true */
export module gromit {

    class gromit {
        wideCSS: any;
        bestLocale: string;
        token: string;
        tokenType: string;
        debugMode: boolean;
        isiPad: boolean;
        hasCanvas: boolean;
        uidCounter: number;

        constructor() {
            this.uidCounter = 0;
        }

        /**
         * This is a helper function to add a CSS link to the HEAD of the current
         * document.
         */
        addCSSLink(file: string) : any {
            jQuery('head').append('<link>');
            var css = $('head').children(':last');
            css.attr({
                rel: 'stylesheet',
                type: 'text/css',
                href: file
            });
            return css;
        }

        isCanvasSupported() : boolean {
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        }

        private updateStyles() : void {
            this.addWideStyle();
        }

        private addWideStyle() : void {
            if ($(window).width() >= 1400 &&
                !g.wideCSS) {
                g.wideCSS = g.addCSSLink('gromit/css/uncompressed_css/client.wide.css');
                return;
            }

            if (g.wideCSS &&
                $(window).width() <= 1400) {
                g.wideCSS.remove();
                delete g.wideCSS;
            }
        }

        init() : void {
            if (this.bestLocale) {
                if (this.bestLocale.indexOf('_#') !== -1) {
                    /*
                    * This means that the browser determined one of the new compound
                    * locales.  However, the moment library doesn't support those yet.
                    * That means we need to strip off the last part.
                    */
                    this.bestLocale = this.bestLocale.substring(0, this.bestLocale.indexOf('_#'));
                }

                moment.locale(this.bestLocale);

                /* 
                * We want to specify the formats for the short dates in English
                * so they don't have the starting zero.
                */
                if (this.bestLocale.indexOf('en') === 0) {
                    moment.locale('en', {
                        longDateFormat: {
                            L: 'M/D/YYYY',
                            LT: 'h:mm A',
                            LL : 'MMMM Do YYYY',
                            LLLL: 'ddd MMMM D YYYY LT'
                        }
                    });
                }
            }

            var localeData = moment.localeData();

            this.token = $.cookie('gromitTokenCookie');
            this.tokenType = $.cookie('gromitTokenTypeCookie');

            if (this.debugMode) {
                this.addCSSLink('gromit/css/humanMsg.css');
                this.addCSSLink('gromit/css/reset.css');
                this.addCSSLink('gromit/css/coreui.css');
            } else {
                this.addCSSLink('gromit/css/gromit-all-min.css');
            }

            this.isiPad = navigator.userAgent.match(/iPad/i) !== null;

            if (this.isiPad) {
                this.addCSSLink('gromit/css/uncompressed_css/ipad.css');
            }
            
            /*
             * If the current browser supports canvas then we'll import paper.
             */
            this.hasCanvas = this.isCanvasSupported();
            

            /*
             * If the current browser is an iPad then we'll load the script to
             * enable touch events for JQuery sortable.
             */

            if (this.isiPad) {
                require(['js/lib/jquery.ui.touch-punch.js'], function() {});
            }

            this.updateStyles();

            $(window).resize(function() {
                this.updateStyles();
            });
        }
    }

    var g = new gromit();

    /**************************************************
     * 
     * This is the start of the exported utility functions
     * 
     **************************************************/

    /**
     * This will be the localization object set up by the localization service.
     * It can be used to access localized strings from JavaScript.
     */
    export var i18n;

    export const noFeedback = 'none';
    export const errorFeedback = 'error';
    export const validFeedback =  'valid';
    export const warningFeedback = 'warning';

    export function init(): void {
        g.init();
    }

    export function addCSSLink(file: string) : any {
        return g.addCSSLink(file);
    }

    /**
     * Create an ID which is unique in the page.
     */
    export function createUniqueId() : string {
        g.uidCounter++;
        return 'gromitid-' + g.uidCounter;
    }

    /**
     * Parse the specified string into a JSON object in a safe way that won't run
     * unsafe scripts.
     */
    export function parseJSON(json: string): Object {
        return JSON.parse(json);
    }

    /**
     * This is a very specialized helper function that can build an anchor with
     * sanitized text using jQuery to make sure the text doesn't run any HTML tags.
     *
     */
    export function buildAnchorWithTextAndClass(cls: string, text: string) : string {
        var a = $('<a href="#"></a>');
        a.addClass(cls);
        a.text(text);

        var span = $('<span></span>');
        span.append(a);
        
        return span.html();
    }

    /**
     * This is a helper function for unifying a date and time into a 
     * single date.  It takes the hours and minutes from the time and
     * sets them into the date and convert the whole thing back to a 
     * number.
     */
    export function unifyDateAndTime(date: number, time: number) : number{
        var d = new Date(date);
        var t = new Date(time);

        d.setHours(t.getHours());
        d.setMinutes(t.getMinutes());

        return d.getTime();
    }

    /**
     * Get the specified color property of the element with the specified ID
     * from CSS
     */
    export function getCSSColor(id: string) : string {
        /*
        * We want to set the color of the circles from CSS, but elements in
        * paper don't have classes or selectors since they aren't DOM elements.
        * The solution is to create a new div tag with a well-known ID and
        * use JavaScript to look at the CSS property color of that tag.
        */
        var div = $('<div id="' + id + '"></div>');
        $('body').append(div);
        var color = div.css('color');
        div.remove();

        return color;
    }

    /**
     * Get the specified property of the element with the specified ID
     * from CSS
     */
    export function getCSSProperty(id: string, propname: string) : string {
        /*
         * We want to set the color of the circles from CSS, but elements in
         * paper don't have classes or selectors since they aren't DOM elements.
         * The solution is to create a new div tag with a well-known ID and
         * use JavaScript to look at the CSS property color of that tag.
         */
        var div = $('<div id="' + id + '"></div>');
        $('body').append(div);
        var color = div.css(propname);
        div.remove();

        return color;
    }

    /**
     * Get the specified property of the element with the specified class
     * from CSS
     */
    export function getCSSPropertyByClass(cls: string, propname: string) : string {
        /*
         * We want to set the color of the circles from CSS, but elements in
         * paper don't have classes or selectors since they aren't DOM elements.
         * The solution is to create a new div tag with a well-known ID and
         * use JavaScript to look at the CSS property color of that tag.
         */
        var div = $('<div class="' + cls + '"></div>');
        $('body').append(div);
        var color = div.css(propname);
        div.remove();

        return color;
    }

    /**
     * Print the specified message to the browser debug console if it is available.
     */
    export function println(msg: string) : void {
        if (window.console) {
            console.info(msg);
        }
    }

    /**
     * Print the specified message to the browser debug console if it is available.
     */
    export function info(msg: string) : void {
        if (window.console) {
            console.info(msg);
        }
    }

    /**
     * Print the javascript object to the browser debug console if it is available.
     */
    export function printObj(object: Object) : void {
        if (window.console) {
            console.info(JSON.stringify(object));
        }
    }

    /**
     * A small improvement on the Underscore isEmpty function which returns true if
     * the argument is undefined.
     */
    export function isEmpty(arg: Object) : boolean {
        return _.isEmpty(arg) && !_.isNumber(arg) && !_.isBoolean(arg);
    };

    /**
     * A little helper utility to validate location arguments
     */
    export function isInvalidL10NArgument(arg: Object) : boolean {
        if (arg === '') {
            return false;
        } else {
            return isEmpty(arg);
        }
    };

    /**
     * Scroll to the top left corner of the page.
     */
    export function scrollToTop() : void {
        window.scrollTo(0, 0);
    }

    export function scrollToElement(elementId: string) : void {
        $('html, body').animate({
            scrollTop: $('#' + elementId).offset().top
        }, 1000);
    }

    /**
     * Log an error to the debug console if the console is available
     */
    export function logerror(code: number, subcode: number, text: string) : void {
        if (window.console) {
            console.error(code + ':' + subcode + ':' + text);
        }
    }

    /**
     * Log a warning to the debug console if the console is available
     */
    export function logWarning(text: string) : void {
        if (window.console) {
            console.warn(text);
        }
    }

    /**
     * Get a string representing the full format of the date and time represented by the specified number.
     */
    export function fullDateTimeFormat(epoch: number) : string {
        if (_.isNumber(epoch)) {
            return moment(epoch).format('LLLL');
        }
    }

    /**
     * Get a string representing the full format of the date represented by the specified number.
     */
    export function fullDateFormat(epoch: number) : string {
        if (_.isNumber(epoch)) {
            return moment(epoch).format('LL');
        }
    }

    /**
     * Get a string representing the amount of time between the specififed date and now
     */
    export function fromNowFormat(epoch: number) : string {
        if (_.isNumber(epoch)) {
            return moment(epoch).fromNow();
        }
    }

    /**
     * Get a string representing the duration between the two specified dates
     */
    export function dateDiff(a: number, b: number) : string {
        return moment.duration(moment(b).diff(moment(a))).humanize();
    }

    /**
     * Get a string representing the short format of the date represented by the specified number.
     */
    export function shortDateFormat(epoch: number, stripTime: boolean) : string {
        if (_.isNumber(epoch)) {
            if (stripTime) {
                return moment(epoch).format('L');
            }
            return moment(epoch).format('L LT');
        }
    };

    /**
     * Set the locale to use for date and time formatting.
     */
    export function setLocale(locale: string) : void {
        moment.locale(locale);
        g.bestLocale = locale;
    }

    /**
     * Strip time off of a date
     */
    export function stripTime(date: number) : string {
        if (_.isNumber(date)) {
            return moment(date).startOf('day').toDate();
        }
    }

    /**
     * Strip time off of a date
     */
    export function startOfDay(date: Date) : Date {
        return moment(date).startOf('day').toDate();
    }

    /**
     * start of tomorrow
     */
    export function beginNextDay(date: Date) : Date {
        return moment(date).startOf('day').add(1, 'day').toDate();
    }

    /**
     * Escape the specified HTML so it is safe to render into the page without causing an XSS issues
     */
    export function escapeHtml(html: string) : string {
        var div = $('<div></div>');
        div.text(html);
        return div.html();
    }

    /**
     * Show a humanized info message
     *
     * @param msg the message to show
     */
    export function showMessage(msg: string) : void {
        require(['gromit/js/lib/humanmsg.js'], function() {
            humanMsg.setup();
            jQuery('#humanMsg').removeClass('humanMsgErr').removeClass('humanMsgWarn').addClass('humanMsgInfo');
            humanMsg.displayMsg(escapeHtml(msg), false);
        });
    };

    /**
     * Show a humanized warning message
     *
     * @param msg the message to show
     * @param shouldLog true if we should log this message and false otherwise
     */
    export function showWarningMessage(msg : string, shouldLog: boolean) : void {
        require(['gromit/js/lib/humanmsg.js'], function() {
            humanMsg.setup();
            jQuery('#humanMsg').removeClass('humanMsgErr').removeClass('humanMsgInfo').addClass('humanMsgWarn');
            humanMsg.displayMsg(escapeHtml(msg), false);

            if (shouldLog) {
                logerror(0, 0, msg);
            }
        });
    };

    /**
     * Show a humanized error message
     *
     * @param msg the message to show
     */
    export function showErrorMessage(msg: string) : void {
        require(['gromit/js/lib/humanmsg.js'], function() {
            humanMsg.setup();
            jQuery('#humanMsg').removeClass('humanMsgWarn').removeClass('humanMsgInfo').addClass('humanMsgErr');
            humanMsg.displayMsg(escapeHtml(msg), false);
            logerror(0, 0, msg);
        });
    };

    export function showGeneralError(code: string, subcode: string, reason: string) : void {
        println('showGeneralError(' + code + ', ' + subcode + ', ' + reason + ')');
        if (!reason) {
            reason = ' ';
        }
        
        // show the fatal error, not showing the code or the subcode
        showFatalError(reason);
    };

    /**
     * Show a fatal error message in the page.
     */
    export function showFatalError(msg: string) : void {
        var errorPanel = $('#errorpanel');

        if (errorPanel.length === 0) {
            errorPanel = $('<div id="errorpanel"><span></span></div>');
            var a = $('<a href="#" id="errorpanel_hide">X</a>');

            errorPanel.append(a);

            a.click(function(e) {
                e.preventDefault();
                errorPanel.hide();
            });

            $('#mainContent').prepend(errorPanel);
        }

        errorPanel.children('span').text(msg);
        errorPanel.show(msg);

        window.scrollTo(0, 0);
    };

    /**
     * Determines if the canvas tag is supported in the current browser.
     */
    export function isCanvasSupported() : boolean {
        return g.isCanvasSupported();
    }

    /**
     * Parse the dateString into a moment using the short date format
     * @param dateString
     * @returns moment
     */
    export function parseShortDateToMoment(dateString: string) : Object {
        return moment(dateString, moment.localeData()._longDateFormat.L);
    }

    /**
     * Validate the date
     * @param dateString
     * @returns true/false
     */
    export function isValidByMoment(dateString: string) : boolean {
        return moment(dateString, moment.localeData()._longDateFormat.L).isValid();
    }

    /**
     * Gets the short date format in the current locale.
     */
    export function getShortDateFormat() : string {
        /*
        * The date formats are a little different between Moment and Angular so we need
        * to tweak them a little bit.
        */
        return moment.localeData()._longDateFormat.L.replace(/D/g, 'd').replace(/Y/g, 'y');
    }

    /**
     * Get data about the current locale
     */
    export function getLocaleData() : Object {
        return moment.localeData();
    }

    /**
     * Gets the first day of the week in the current locale.  The value is a number like
     * 0 for Sunday and 1 for Monday
     *
     */
    export function getFirstDayOfWeek() : number {
        return moment.localeData()._week.dow;
    }

    /** convert "color" css property from jQuery to RGB array
     * jQuery returns "rgb(100,100, 100)"  or "#aabbcc" depended on the browser
     */
    export function jQueryCssToRGB(str: string) : number[] {
        var rgb = str.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (rgb) {
            return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
        } else {
            return hexToRGB(str);
        }
    };

    /**
     * convert hex color to rgb
     */
    export function hexToRGB(h: string) : number[] {
        var str = (h.charAt(0) === '#') ? h.substring(1, 7) : h;
        return [parseInt(str.substring(0, 2), 16), parseInt(str.substring(2, 4), 16), parseInt(str.substring(4, 6), 16)];
    }

    /**
     * convert rgb color to hex
     */
    export function rgbToHex(r: number, g: number, b: number): string {
        /* can't use the below code due to compile error during gwt compiling*/
        //    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        //    console.log('rgb value r=' + r + ' g=' + g + ' b=' + b + "Hex value= " + "#" + gromit.componentToHex(r) + gromit.componentToHex(g) + gromit.componentToHex(b));
        return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };

    /**
     * Change int to hex value
     */
    export function componentToHex(c: number): string {
        var hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    export function isNumber(n: any) : boolean {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    /**************************************************
     * 
     * This is the start of the exported security functions
     * 
     **************************************************/

    /**
     * Get the current security token
     */    
    export function getToken() : string {
        return g.token;
    }

    /**
     * Set the current security token
     */    
    export function setToken(token: string): void {
        g.token = token;
    }

    /**
     * Clear out the token
     */    
    export function clearToken(): void {
        delete g.token;
    }

    /**
     * Get the current security token type
     */    
    export function getTokenType() : string {
        return g.tokenType;
    }

    /**
     * Set the current security token type
     */    
    export function setTokenType(tokenType: string): void {
        g.tokenType = tokenType;
    }

    /**
     * Clear out the token type
     */    
    export function clearTokenType(): void {
        delete g.tokenType;
    }

    export declare var AuthUrl: string;
    export declare var AuthLogoutUrl: string;
    export declare var ClientId: string;
    
    
};

angular.module('gromitsoft', []);