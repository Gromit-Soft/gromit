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

/**
 * Get a specified JSON resource from the server.
 *
 * @param url the URL of the resource
 * @param http the Angular HTTP object to make the request with
 * @param successCallback the function that will be called back with the data
 * @param errorCallback the function that will be called back if the request fails
 * @param unknownErrorCallback the function that will be called back if the request fails
 */
gromit.get = function(/*String*/ url, /*Angular HTTP object*/ http, /*function*/ successCallback, /*function*/ errorCallback,
              /*function*/ unknownErrorCallback) {
    var req = {
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        }
    };

    req.http = http;
    req.successCallback = successCallback;
    req.errorCallback = errorCallback;
    req.unknownErrorCallback = unknownErrorCallback;
    gromit.doRequest(req);

};

/**
 * Get a specified JSON resource as a promise from the server.
 * Used only for typeahead
 *
 * @param url the URL of the resource
 * @param http the Angular HTTP object to make the request with
 * @param errorCallback (optional)
 */
gromit.getPromise = function(/*String*/ url, /*Angular HTTP object*/ http, /*function*/ errorCallback) {
    var req = {
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        }
    };

    req.http = http;
    req.errorCallback = errorCallback;
    return gromit.requestPromise(req);
};

/**
 * POST to GET a specified JSON resource as a promise from the server.
 * Used only for typeahead that require post for searchCriteria
 *
 * @param url the URL of the resource
 * @param http the Angular HTTP object to make the request with
 */
gromit.postPromise = function(/*String*/ url, /*Angular HTTP object*/ http, /*JSON*/ data) {
    var req = {
        method: 'POST',
        url: url,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    };

    req.http = http;
    return gromit.requestPromise(req);
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
gromit.post = function(/*String*/ url, /*Angular HTTP object*/ http, /*String*/ data, /*function*/ successCallback,
               /*function*/ errorCallback, /*function*/ unknownErrorCallback, /*Object*/ headers) {
    if (!headers) {
        headers = {};
    }
    var req = {
        method: 'POST',
        url: url,
        headers: headers,
        data: data
    };
    
    if (!req.headers['Content-Type']) {
        req.headers['Content-Type'] = 'application/json';
    }
    
    if (!req.headers.Accept) {
        req.headers.Accept = 'application/json';
    }

    req.http = http;
    req.successCallback = successCallback;
    req.errorCallback = errorCallback;
    req.unknownErrorCallback = unknownErrorCallback;

    gromit.doRequest(req);
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
gromit.put = function(/*String*/ url, /*Angular HTTP object*/ http, /*String*/ data,
                   /*function*/ successCallback, /*function*/ errorCallback, /*function*/ unknownErrorCallback) {
    var req = {
        method: 'PUT',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: data
    };

    req.http = http;
    req.successCallback = successCallback;
    req.errorCallback = errorCallback;
    req.unknownErrorCallback = unknownErrorCallback;

    gromit.doRequest(req);

};

/**
 * Delete a specified resource form the server
 *
 * @param url the URL of the resource
 * @param http the Angular HTTP object to make the request with
 * @param successCallback the function that will be called back with the data
 * @param errorCallback the function that will be called back if the request fails
 * @param unknownErrorCallback the function that will be called back if the request fails
 */
gromit.del = function(/*String*/ url, /*Angular HTTP object*/ http, /*function*/ successCallback, /*function*/ errorCallback,
    /*function*/
    unknownErrorCallback) {
    var req = {
        method: 'DELETE',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        data: {}
    };

    req.http = http;
    req.successCallback = successCallback;
    req.errorCallback = errorCallback;
    req.unknownErrorCallback = unknownErrorCallback;

    gromit.doRequest(req);

};
