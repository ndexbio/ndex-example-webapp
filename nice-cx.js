/**
 * Created by dexter on 8/17/17.
 */
(function(window){
  'use strict';

  // This function creates an ndex client object
  function makeNiceCX(){
    var _niceCXFactory = {};

    /*---------------------------------------------------------------------*
     * ****  Public NiceCX  Constructors ****
     *---------------------------------------------------------------------*/

    _niceCXFactory.makeNiceCXFromCXStream = function (CXStream){
      console.log(CXStream);

      return null;

    };

    /*---------------------------------------------------------------------*
     * **** NiceCX Object Functions****
     *---------------------------------------------------------------------*/

    return _niceCXFactory;
  }

  /*---------------------------------------------------------------------*
   * the window variable 'ndex' is set to an instance of _ndexClientObject
   * returned by ndexClient unless 'ndex' is already defined
   * in which case we throw an error
   *---------------------------------------------------------------------*/

  if(typeof(window.niceCX) === 'undefined'){
    window.niceCX = makeNiceCX();
  }

})(window); // execute this closure on the global window
