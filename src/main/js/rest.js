/*******************************************************************************
 * 
 * MIT License
 * Copyright (c) 2015-2018 NetIQ Corporation, a Micro Focus company
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
 * Get a specified JSON resource from the server and indicate that this is a background request.  
 * That means this call will not extend the life of any sessions or security tokens.
 *
 * @param url the URL of the resource
 * @param http the Angular HTTP object to make the request with
 * @param successCallback the function that will be called back with the data
 * @param errorCallback the function that will be called back if the request fails
 * @param unknownErrorCallback the function that will be called back if the request fails
 */
gromit.getInBackground = function(/*String*/ url, /*Angular HTTP object*/ http, /*function*/ successCallback, 
                                  /*function*/ errorCallback, /*function*/ unknownErrorCallback) {
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
    req.isBackground = true;
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

// We support both AngularJS and Angular, but 
// the code execution paths are slightly different, so we
// must determine where we are running
    
// simple check to see if we are angular or angularJS
// In angularJS, req.http is a function,
// In angular, req.http is not
var isAngularJS = function(req) {
    return _.isFunction(req.http);
};

/**
 * POST multipart data to the server.  This function works like the normal post function, but
 * it explicitely unsets the Content-Type header and does not set the Accept header to allow for 
 * other data types in addition to JSON.
 * 
 * Note the above logic only applies to AngularJS, as Angular requires no Content-Type header to be included
 *
 * @param url the URL of the resource
 * @param http the AngularJS HTTP object, or Angular httpClient to make the request with
 * @param data the form data to send to the server  (file: file, data: jsondata}
 * @param successCallback the function that will be called back with the data
 * @param errorCallback the function that will be called back if the request fails
 * @param unknownErrorCallback the function that will be called back if the request fails
 */
gromit.postMultipart = function(/*String*/ url, /*Angular HTTP object*/ http, /*String*/ data, /*function*/ successCallback,
                                /*function*/ errorCallback, /*function*/ unknownErrorCallback) {

    var req = {
        method: 'POST',
        url: url,
        data: data
    };

    req.http = http;

    // angularJS needs content-type to be undefined, transformRequest to be identity.
    // angular creates it's own content-type header, it MUST not be included at all
    if (isAngularJS(req)) {
        req.headers = { 'Content-Type' : undefined };        
        req.transformRequest = angular.identity;     
    } else {
        req.headers = {};  
    }

    req.successCallback = successCallback;
    req.errorCallback = errorCallback;
    req.unknownErrorCallback = unknownErrorCallback;
    gromit.doRequest(req);
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
    
    gromit.postWithRequest({
        method: 'POST',
        url: url,
        headers: headers,
        data: data
    }, http, successCallback, errorCallback, unknownErrorCallback);
};

/**
 * @private
 */
gromit.postWithRequest = function(/*Object*/ req, /*Angular HTTP object*/ http, /*function*/ successCallback,
                                  /*function*/ errorCallback, /*function*/ unknownErrorCallback, /*Object*/ headers) {
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
 * POST JSON data to the server
 *
 * @param url the URL of the resource
 * @param http the Angular HTTP object to make the request with
 * @param data the data to send to the server
 * @param successCallback the function that will be called back with the data
 * @param errorCallback the function that will be called back if the request fails
 * @param unknownErrorCallback the function that will be called back if the request fails
 */
gromit.postInBackground = function(/*String*/ url, /*Angular HTTP object*/ http, /*String*/ data, /*function*/ successCallback,
                                   /*function*/ errorCallback, /*function*/ unknownErrorCallback, /*Object*/ headers) {
    if (!headers) {
        headers = {};
    }
    
    gromit.postWithRequest({
        method: 'POST',
        url: url,
        headers: headers,
        data: data,
        isBackground: true
    }, http, successCallback, errorCallback, unknownErrorCallback);
};

/**
 * PUT multipart data to the server.  This function works like the normal put function, but
 * it explicitely unsets the Content-Type header and does not set the Accept header to allow for 
 * other data types in addition to JSON.
 * 
 * Note the above logic only applies to AngularJS, as Angular requires no Content-Type header to be included
 *
 * @param url the URL of the resource
 * @param http the AngularJS HTTP object, or Angular httpClient to make the request with
 * @param data the form data to send to the server  (file: file, data: jsondata}
 * @param successCallback the function that will be called back with the data
 * @param errorCallback the function that will be called back if the request fails
 * @param unknownErrorCallback the function that will be called back if the request fails
 */
gromit.putMultipart = function(/*String*/ url, /*Angular HTTP object*/ http, /*String*/ data, /*function*/ successCallback,
                               /*function*/ errorCallback, /*function*/ unknownErrorCallback) {
    var req = {
        method: 'PUT',
        url: url,
        data: data
    };

    req.http = http;

    // angularJS needs content-type to be undefined, transformRequest to be identity.
    // angular creates it's own content-type header, it MUST not be included at all
    if (isAngularJS(req)) {
        req.headers = { 'Content-Type' : undefined };        
        req.transformRequest = angular.identity;     
    } else {
        req.headers = {};  
    }

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
