/**
 * Created by dexter on 8/13/17.
 */
// Thanks to http://ourcodeworld.com/
// for the tutorial and code example
// about creating javascript libraries

// This library depends on jquery.js

(function (window) {
    'use strict';

    // This function creates an ndex client object
    function makeNdexClient() {
        var _ndexClientObject = {};

        /*---------------------------------------------------------------------*
         * Client settings
         *---------------------------------------------------------------------*/

        // this is a private variable visible in the scope ndexClient
        var clientSettings = {
            ndexServerUri: "www.ndexbio.org"
        };

        // this is a public function to set a private variable
        _ndexClientObject.setNdexServerUri = function (uri) {
            // TODO - verify that the string is a valid uri
            clientSettings.ndexServerUri = uri;
        };

        // this is a public function to return a private variable value
        _ndexClientObject.getNdexServerUri = function () {
            return clientSettings.ndexServerUri;
        };

        /*---------------------------------------------------------------------*
         * Errors
         *---------------------------------------------------------------------*/
/*
        var ndexError = function (string) {
            console.log(string);
        };
*/
        /*---------------------------------------------------------------------*
         * ID, Authentication, Credentials, Abort
         *---------------------------------------------------------------------*/

        // public functions

        _ndexClientObject.clearUserCredentials = function () {
            localStorage.setItem('loggedInUser', null);
        };

        _ndexClientObject.setUserCredentials = function (accountName, externalId, token) {
            if (localStorage) {
                var loggedInUser = {};
                loggedInUser.accountName = accountName;
                loggedInUser.token = token;
                loggedInUser.externalId = externalId;
                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            }
        };

        _ndexClientObject.getUserCredentials = function () {
            if (localStorage) {
                var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                if (loggedInUser === null) {
                    return null;
                }
                return {
                    accountName: loggedInUser.accountName,
                    externalId: loggedInUser.externalId,
                    token: loggedInUser.token
                };
            }
        };

        _ndexClientObject.setUserInfo = function (accountName, externalId) {
            var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                loggedInUser = {};
            }
            loggedInUser.accountName = accountName;
            loggedInUser.externalId = externalId;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        };

        _ndexClientObject.getUserInfo = function () {
            return JSON.parse(localStorage.getItem('loggedInUser'));
        };

        // private functions
/*
        var setUserAuthToken = function (token) {
            var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                loggedInUser = {};
            }
            loggedInUser.token = token;
            localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        };
*/

        /*
         var getLoggedInUserExternalId = function () {
         var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
         if (!loggedInUser) {
         loggedInUser = {};
         }
         return loggedInUser.externalId;
         };
         */
        var getLoggedInUserAccountName = function () {
            var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                loggedInUser = {};
            }
            return loggedInUser.accountName;
        };

        var getLoggedInUserAuthToken = function () {
            var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                loggedInUser = {};
            }
            return loggedInUser.token;
        };

        /*---------------------------------------------------------------------*
         * Returns the user's credentials as required by Basic Authentication base64
         * encoded.
         *---------------------------------------------------------------------*/

        var getEncodedUser = function () {
            if (getLoggedInUserAccountName() !== undefined && getLoggedInUserAccountName() !== null) {
                return btoa(getLoggedInUserAccountName() + ':' + getLoggedInUserAuthToken());
            } else {
                return null;
            }
        };

        var addAuth = function (encodedUser, options) {
            if (!options.headers){
                options.headers = {}
            }
            if (encodedUser) {
                options.headers.Authorization = 'Basic ' + getEncodedUser();
            }
            else {
                options.headers.Authorization = undefined;
            }
        };

        /*
         var requestWithAbort = function (config) {
         // The $http timeout property takes a deferred value that can abort AJAX request
         var deferredAbort = $q.defer();

         config.timeout = deferredAbort.promise;

         // We keep a reference ot the http-promise. This way we can augment it with an abort method.
         var request = $http(config);

         // The $http service uses a deferred value for the timeout. Resolving the value will abort the AJAX request
         request.abort = function () {
         deferredAbort.resolve();
         };

         // Make garbage collection smoother by forcing the request.abort to an empty function
         // and then set the deferred abort and the request to null
         // This cleanup is performed once the request is finished.
         request.finally(
         function () {
         request.abort = angular.noop; // angular.noop is an empty function
         deferredAbort = request = null;
         }
         );

         return request;
         };
         */

        /*---------------------------------------------------------------------*
         * private function to be an NDEx wrapper around JQuery AJAX
         * returns a jXHR object
         *---------------------------------------------------------------------*/

        var ndexAjax = function (method, route, data, options) {
            var url = "http://" + clientSettings.ndexServerUri + "/v2" + route;
            options.method = method;
            if (data){
                options.data = data;
            }
            addAuth(getEncodedUser(), options);
            return $.ajax(url, options);
        };

        /*---------------------------------------------------------------------*
         * ****  NDEx REST API  ****
         *  (public functions)
         *---------------------------------------------------------------------*/

        /*---------------------------------------------------------------------*
         * Search
         *---------------------------------------------------------------------*/
        // Search Networks POST /search/network?start={number}&size={number}
        _ndexClientObject.searchNetworks = function (query, startPage, pageSize, options) {
            return ndexAjax('POST', '/search/network?start=' + startPage + ' size=' + pageSize , query, options);
        };

        // Search Networks POST /search/user?start={number}&size={number}
        _ndexClientObject.searchUsers = function (query, startPage, pageSize, options) {
            return ndexAjax('POST', '/search/user?start=' + startPage + ' size=' + pageSize , query, options);
        };

        // Search Groups POST /search/group?start={number}&size={number}
        _ndexClientObject.searchGroups = function (query, startPage, pageSize, options) {
            return ndexAjax('POST', '/search/group?start=' + startPage + ' size=' + pageSize , query, options);
        };

        // Get a network 'neighborhood'
        // POST /search/network/{networkId}/query
        _ndexClientObject.searchGroups = function (networkId, searchString, searchDepth, edgeLimit, options) {
            var query = {
                searchString: searchString,
                searchDepth: searchDepth,
                edgeLimit: edgeLimit
            };
            return ndexAjax('POST', '/search/network' + networkId + '/query', query, options);
        };

        /*---------------------------------------------------------------------*
         * Users
         *---------------------------------------------------------------------*/

        // authenticate user by username and password
        _ndexClientObject.authenticateUser = function (userName, password, options) {
            // Server API: Authenticate User
            // GET /user?valid=true
            var url = "http://" + clientSettings.ndexServerUri + "/v2/user?valid=true";
            options.headers = {
                'Authorization': "Basic " + btoa(userName + ":" + password)
            };
            options.data = {format: 'json'};
            return $.ajax(url, options);
        };

        /*---------------------------------------------------------------------*
         * Networks
         *---------------------------------------------------------------------*/

        // Get a Network Summary GET  /network/{networkid}/summary?accesskey={accessKey}
        _ndexClientObject.getNetworkSummary = function (networkId, options) {
            return ndexAjax('GET', '/network/' + networkId + "/summary", null, options);
        };

        // Create a network POST /network
        // Post as form data
        // default processing of data is turned off
        // instead CX is explicitly processed into a blob and appended to
        // the form data using the attribute CXNetworkStream
        _ndexClientObject.createNetwork = function (cx, options) {
            var formData = new FormData();
            var content = JSON.stringify(cx);
            var blob = new Blob([content], { type: "application/octet-stream"});
            formData.append('CXNetworkStream', blob);
            var url = "http://" + clientSettings.ndexServerUri + "/v2/network";
            options.method = "POST";
            options.processData = false;
            options.contentType = false;
            options.data = formData;
            addAuth(getEncodedUser(), options);
            return $.ajax(url, options);
        };

        // this is useful when you want the UUID of a newly created network, not its URL
        _ndexClientObject.getUUIDfromURL = function(networkURL){
            var elements = networkURL.split('/');
            return elements[elements.length - 1];
        };

        // TODO
        // Update a network PUT /network/{networkid}

        // Delete a network DELETE /network/{networkid}
        _ndexClientObject.deleteNetwork = function (networkId, options) {
            return ndexAjax('DELETE', '/network/' + networkId, null, options);
        };

        // Get Complete Network in CX format GET  /network/{networkid}?accesskey={accessKey}
        _ndexClientObject.getNetwork = function (networkId, options) {
            return ndexAjax('GET', '/network/' + networkId, null, options);
        };

        // Get Network Sample GET /network/{networkid}/sample?accesskey={accessKey}
        _ndexClientObject.getNetworkSample = function (networkId, options) {
            return ndexAjax('GET', '/network/' + networkId + '/sample', null, options);
        };

        // TODO
        // Set Sample Network PUT
        // /network/{networkid}/sample

        // Set Network System Properties PUT /network/{networkId}/systemproperty
        _ndexClientObject.setNetworkSystemProperties = function (networkId, properties, options) {
            return ndexAjax('PUT', '/network/' + networkId + '/systemproperty', properties, options);
        };

        // Get All Permissions on a Network GET
        // /network/{networkid}/permission?type={user|group}&permission={permission}&start={startPage}&size={pageSize}
        _ndexClientObject.getNetworkPermissions = function (networkId, type, permission, startPage, pageSize, options) {
            var args = {
                type: type,
                permission: permission,
                start: startPage,
                size: pageSize
            };
            return ndexAjax('GET', '/network/' + networkId + '/permission', args, options);
        };

        // Update Network Permission PUT
        // /network/{networkid}/permission?(userid={uuid}|groupid={uuid})&permission={permission}
        _ndexClientObject.updateNetworkPermission = function (networkId, type, id, permission, options) {
            var args = {permission: permission};
            if (type === 'user'){
                args.userid = id;
            } else if (type === 'group'){
                args.groupid = id;
            }
            return ndexAjax('PUT', '/network/' + networkId + '/permission', args, options);
        };

        // Delete Network Permission DELETE /network/{networkid}/permission?(userid={uuid}|groupid={uuid})
        _ndexClientObject.deleteNetworkPermission = function (networkId, type, id, options) {
            var args = {};
            if (type === 'user'){
                args.userid = id;
            } else if (type === 'group'){
                args.groupid = id;
            }
            return ndexAjax('DELETE', '/network/' + networkId + '/permission', args, options);
        };


        /*---------------------------------------------------------------------*
         * ****  Finally, return the client object  ****
         *---------------------------------------------------------------------*/
        return _ndexClientObject;
    }

    /*---------------------------------------------------------------------*
     * the window variable 'ndex' is set to an instance of _ndexClientObject
     * returned by ndexClient unless 'ndex' is already defined
     * in which case we throw an error
     *---------------------------------------------------------------------*/

    if (typeof(window.ndexClient) === 'undefined') {
        window.ndexClient = makeNdexClient();
    }

})(window); // execute this closure on the global window
