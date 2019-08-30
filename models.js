(function() {
  'use strict';
  angular.module('app').factory('addressModel', function() {
    var addressListRaw = [];
    var addressListProcesses = [];

    var addAddressRaw = function(newObj) {
      addressListRaw.push(newObj);
    };

    var addAddressProcessed = function(newObj) {
      addressListProcesses.push(newObj);
    };

    var getAddressRawList = function() {
      return addressListRaw;
    };

    var getAddressProcessedList = function() {
      return addressListProcesses;
    };

    var clearModel=function() {
      addressListRaw = [];
      addressListProcesses = [];
    };

    return {
      addAddressRaw: addAddressRaw,
      addAddressProcessed: addAddressProcessed,
      getAddressRawList: getAddressRawList,
      getAddressProcessedList: getAddressProcessedList,
      clearModel:clearModel
    };
  });
})()
