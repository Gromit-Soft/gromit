/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2016 NetIQ Corporation, a Micro Focus company
 *
 ******************************************************************************/

import {gromit_oauth} from './oauth.ts'

declare var _;
declare var $;
declare var angular;
 
export module gromit_rest {

    class Request {
        http: any;
        successCallback: Function;
        errorCallback: Function;
        unknownErrorCallback: Function;
        isBackground: boolean;
        data: Object;

        constructor(public method: string, public url: string, public headers: {}) {
            this.isBackground = false;
        }
    }

    /**
     * Get a specified JSON resource from the server.
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param successCallback the function that will be called back with the data
     * @param errorCallback the function that will be called back if the request fails
     * @param unknownErrorCallback the function that will be called back if the request fails
     */
    export function get(url: string, http: any, successCallback: Function, errorCallback: Function, 
                        unknownErrorCallback: Function) {
        var req = new Request('GET', url, {
            'Accept': 'application/json'
        });

        req.http = http;
        req.successCallback = successCallback;
        req.errorCallback = errorCallback;
        req.unknownErrorCallback = unknownErrorCallback;
        gromit_oauth.doRequest(req);

    }

    /**
     * Get a specified JSON resource from the server and indicate that this is a background request.  
     * That means this call will not extend the life of any sessions or security tokens.
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param successCallback the function that will be called back with the data
     * @param errorCallback the function that will be called back if the request fails
     * @param unknownErrorCallback the function that will be called back if the request fails
     */
    export function getInBackground(url: string, http: any, successCallback: Function, 
                                    errorCallback: Function, unknownErrorCallback: Function) {
        var req = new Request('GET', url, {
            'Accept': 'application/json'
        });
        req.method = 'GET';
        req.url = url;
        req.headers = {
            'Accept': 'application/json'
        }

        req.http = http;
        req.successCallback = successCallback;
        req.errorCallback = errorCallback;
        req.unknownErrorCallback = unknownErrorCallback;
        req.isBackground = true;
        gromit_oauth.doRequest(req);

    }

    /**
     * Get a specified JSON resource as a promise from the server.
     * Used only for typeahead
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param errorCallback (optional)
     */
    export function getPromise(url: string, http: any, errorCallback: Function) {
        var req = new Request('GET', url, {
            'Accept': 'application/json'
        });

        req.http = http;
        req.errorCallback = errorCallback;
        return gromit_oauth.requestPromise(req);
    };

    /**
     * POST to GET a specified JSON resource as a promise from the server.
     * Used only for typeahead that require post for searchCriteria
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     */
    export function postPromise(url: string, http: any, data: Object) {
        var req = new Request('POST', url, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        });
        req.data = data;
        req.http = http;
        return gromit_oauth.requestPromise(req);
    };

    /**
     * POST JSON data to the server
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param data the data to send to the server
     * @param successCallback the function that will be called back with the data
     * @param errorCallback the function that will be called back if the request fails
     * @param unknownErrorCallback the function that will be called back if the request fails
     */
    export function post(url: string, http: any, data: string, successCallback: Function,
                         errorCallback: Function, unknownErrorCallback: Function, headers: {}) {
        if (!headers) {
            headers = {};
        }

        var req = new Request('POST', url, headers);
        req.data = data;
        
        postWithRequest(req, http, successCallback, errorCallback, unknownErrorCallback);
    }

    function postWithRequest(req: Request, http: any, successCallback: Function, errorCallback: Function, 
                             unknownErrorCallback: Function) {
        if (!req.headers['Content-Type']) {
            req.headers['Content-Type'] = 'application/json';
        }
        
        if (!req.headers['Accept']) {
            req.headers['Accept'] = 'application/json';
        }

        req.http = http;
        req.successCallback = successCallback;
        req.errorCallback = errorCallback;
        req.unknownErrorCallback = unknownErrorCallback;

        gromit_oauth.doRequest(req);
    }

    /**
     * POST JSON data to the server
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param data the data to send to the server
     * @param successCallback the function that will be called back with the data
     * @param errorCallback the function that will be called back if the request fails
     * @param unknownErrorCallback the function that will be called back if the request fails
     */
    export function postInBackground(url: string, http: any, data: string, successCallback: Function,
                                     errorCallback: Function, unknownErrorCallback: Function, headers: {}) {
        if (!headers) {
            headers = {};
        }

        var req = new Request('POST', url, headers);
        req.data = data;
        req.isBackground = true;
        
        postWithRequest(req, http, successCallback, errorCallback, unknownErrorCallback);
    };

    /**
     * PUT JSON data to the server
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param data the data to send to the server
     * @param successCallback the function that will be called back with the data
     * @param errorCallback the function that will be called back if the request fails
     * @param unknownErrorCallback the function that will be called back if the request fails
     */
    export function put(url: string, http: any, data: Object, successCallback: Function, 
                        errorCallback: Function, unknownErrorCallback: Function) {

        var req = new Request('PUT', url, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        req.data = data;
        req.http = http;
        req.successCallback = successCallback;
        req.errorCallback = errorCallback;
        req.unknownErrorCallback = unknownErrorCallback;

        gromit_oauth.doRequest(req);

    }

    /**
     * Delete a specified resource form the server
     *
     * @param url the URL of the resource
     * @param http the Angular HTTP object to make the request with
     * @param successCallback the function that will be called back with the data
     * @param errorCallback the function that will be called back if the request fails
     * @param unknownErrorCallback the function that will be called back if the request fails
     */
    export function del(url: string, http: any, successCallback: Function, errorCallback: Function, unknownErrorCallback: Function) {

        var req = new Request('DELETE', url, {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        req.data = {};
        req.http = http;
        req.successCallback = successCallback;
        req.errorCallback = errorCallback;
        req.unknownErrorCallback = unknownErrorCallback;

        gromit_oauth.doRequest(req);

    }
}