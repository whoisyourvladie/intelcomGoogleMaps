(function() {
  'use strict';
  angular.module('app').service('uploadService', function($http, $q,$timeout) {
    var googleOcrApi = "https://vision.googleapis.com/v1/images:annotate?key=";
    var api_key_google_vision = "AIzaSyArnrcrPntzeOcnzZyPbyPhIPBuDByejFA";

    this.uploadeImagestoGoogle = function(base64array) {
      var deferred = $q.defer();
      var requests = processOneImage(base64array);
      let files = [];
      $q.all(requests)
        .then(function(response) {
          console.log(response);
          deferred.resolve(response);
        })

        .catch(function(error) {
          console.log(error);
        });

      return deferred.promise;
    }

    function processOneImage(base64array) {
      return base64array.map(function(base64) {

        var json = {
          "requests": [{
            "image": {
              "content": base64.base64
            },
            "features": [{
              "type": "TEXT_DETECTION",
              "maxResults": 1
            }]
          }]
        };

        return $http.post(googleOcrApi + api_key_google_vision, JSON.stringify(json));
      });
    };

    this.getGeoLocation = function(addressArray) {
      var deferred = $q.defer();
      var requests = getGeoData(addressArray);
      let addresses = [];
      $q.all(requests)
        .then(function(response) {

          // angular.forEach(response,function(address){
          //   addresses.push(address);
          //   });
          console.log(response);
          deferred.resolve(response);
        })

        .catch(function(error) {
          console.log(error);
        });

      return deferred.promise;
    };

    function getGeoData(addressArray) {
      return addressArray.map(function(address) {

        var config = {
          params: {
            address: address,
            key: 'AIzaSyArnrcrPntzeOcnzZyPbyPhIPBuDByejFA'
          }
        };

        return $http.get('https://maps.googleapis.com/maps/api/geocode/json', config);
      });
    }
  });
})()
