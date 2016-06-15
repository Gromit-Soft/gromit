/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2016 NetIQ Corporation, a Micro Focus company
 *
 ******************************************************************************/

import {gromit} from './gromit.ts'

declare var _;
declare var $;
 
module gRequest {
    var reqs = [];

    /**
    * @private
    * 
    * This function prepares a request by adding it to the request queue or making
    * the request directly.
    */
    export function doRequest(req: any) {
        if (reqs.length > 0) {
            /*
            * This means we are already in the process of logging in.  We don't want to
            * fire off this request just to start the login process all over again.  We
            * just want to hold onto this request until we can replay it.
            */
            reqs.push(req);
        } else {
            request(req);
        }
    }

    /**
     * @private
     *
     * This function does the actual request to the server based on the request object
     * with configured parameters.
     */
    export function request(req: any) {
        if (gromit.getToken()) {
            req.headers.Authorization = gromit.getTokenType() + ' ' + gromit.getToken();
        }

        if (!req.errorCallback) {
            /*
            * If there's no error callback then we want to handle errors in the generic way
            */
            req.errorCallback = function(code, subcode, reason) {
                gromit.println('errorCallback(' + code + ', ' + subcode + ', ' + reason + ')');
                if (subcode === 'NotFound') {
                    gromit.showFatalError(gromit.i18n.getI18n_general_error_notfound(req.url));
                } else {
                    gromit.showGeneralError(code, subcode, reason);
                }
            };
        }

        if (!_.isFunction(req.http)) {
            throw 'The http object in the request was not a function.  This normally happens when you haven\'t ' +
            'declared $http in the definition of your controller.';
        }

        var responsePromise = req.http(req);

        responsePromise.success(function(data, status, headers, config) {
            if (req.successCallback) {
                req.successCallback(data, status, headers, config);
            }
        });

        var validateTime = function() {
            if (!$.cookie('ar-time')) {
                /*
                * This means we aren't supporting cookies and this check won't work
                */
                return true;
            }

            /*
            * There are some very strange bugs, especially on IE, when the client time gets very far off
            * from the server time.  It can also cause issues with SSL certificates.  This code checks to
            * see if the server time and the client time are more than one week different.  If they are
            * then we will show an error and the user won't be able to access the application.
            */
            var serverTime = parseInt($.cookie('ar-time'), 10);
            var clientTime = new Date().getTime();

            if (Math.abs(clientTime - serverTime) < 604800000) {
                return true;
            }

            setTimeout(function() {
                $('div.pageloading').hide();
                $('div.invalidTime').show();
        
                if (clientTime > serverTime) {
                    $('div.invalidTime').children('h1').text(gromit.i18n.invalid_client_time_ahead);
                } else {
                    $('div.invalidTime').children('h1').text(gromit.i18n.invalid_client_time_behind);
                }
        
                $('div.invalidTime').children('p').text(gromit.i18n.getI18n_invalid_client_time_error(gromit.fullDateTimeFormat(clientTime)));
            }, 3000);
            
            return false;
            

        };

        var handle401 = function(req) {
            if (!validateTime()) {
                gromit.println('the time was not valid');
                return;
            }
            
            /*
            * This means they haven't logged in yet and we need to add this request to the
            * request stack and prompt them to log in
            */
            gromit.clearToken();
            gromit.clearTokenType();
            reqs.push(req);
            if (reqs.length === 1) {
                doLogin(req);
            }
        };

        responsePromise.error(function(data, status, headers, config) {
            if (status === 0) {
                /*
                * This means we weren't able to contact the server at all
                */
                gromit.showFatalError('Unable to contact server at ' + req.url);
            } else if (data && data.Fault) {
                /*
                * This means the server returned a RESTException
                */
                if (status === 401 &&
                    (data.Fault.Code.Subcode.Value === 'NoCredentials' ||
                        data.Fault.Code.Subcode.Value === 'Expired')) {
                    handle401(req);
                } else if (req.errorCallback) {
                    /*
                    * This means it was just a normal RESTException and we want to pass it back
                    * to the calling code.
                    */
                    req.errorCallback(data.Fault.Code.Value, data.Fault.Code.Subcode.Value, data.Fault.Reason.Text);
                }
            } else {
                /*
                * This means we got a response from the server which didn't have JSON data
                */
                if (status === 404) {
                    /*
                    * If the item wasn't found then we want to send that to the calling code
                    */
                    req.errorCallback('Sender', 'NotFound', '');
                } else if (status === 401) {
                    handle401(req);
                } else if (req.unknownErrorCallback) {
                    /*
                    * This means they gave us a special handler for generic exceptions
                    */
                    req.unknownErrorCallback(data, status, headers);
                } else {
                    if (data) {
                        gromit.showFatalError(gromit.i18n.getI18n_fatal_request_error(req.url, status, data));
                    } else {
                        gromit.showFatalError(gromit.i18n.getI18n_fatal_request_error(req.url, status, ''));
                    }
                    if (window.console) {
                        console.error(gromit.showFatalError(gromit.i18n.getI18n_fatal_request_error(req.url, status, data)));
                    }
                }
            }
        });
        
        return responsePromise;
    }
    
}