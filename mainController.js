(function() {
  'use strict';
  angular.module('app').controller('mainController', ['$scope', 'uploadService', '$rootScope', 'addressModel',

    function($scope, uploadService, $rootScope, addressModel) {
      $scope.showresult = false;
      $scope.isBusy = false;
      let postOcrUrl = "https://api.ocr.space/parse/image";
      let api_key_ocr = "";
      let api_key_google_vision = "";
      let fi = $scope.jpegFile;
      $scope.isFile = false;
      $scope.files = [];
      $scope.onChange = function(e, fileList) {
        addressModel.clearModel();
        uploadService.uploadeImagestoGoogle(fileList)
          .then(function(response) {
            console.log();
            for (let i = 0; i < response.length; i++) {
              let imageAddrArr = response[i].data.responses[0].fullTextAnnotation.text.split("\n");
              for (var j = 0; j < imageAddrArr.length; j++) {
                if (imageAddrArr[j].length > 20) {
                  addressModel.addAddressRaw(imageAddrArr[j]);
                }
              }
            }
            let resultArrRaw = addressModel.getAddressRawList();
            let resultArr = [];
            angular.forEach(resultArrRaw, function(addr) {
              if (addr.length > 20) {
                resultArr.push(addr);
              }
            });
            return uploadService.getGeoLocation(resultArr);
          })
          .then(function(json) {
            angular.forEach(json, function(data) {
              if (data) {
                let straddress = data.data.results[0].formatted_address;
                let lat = data.data.results[0].geometry.location.lat;
                let long = data.data.results[0].geometry.location.lng;
                addressModel.addAddressProcessed({
                  address: straddress,
                  lat: lat,
                  long: long
                });
              }
            })
            $scope.isBusy = false;
            let markersList = addressModel.getAddressProcessedList();
            let marker;
            for (let i = markersList.length - 1; i >= 0; i--) {
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(markersList[i].lat, markersList[i].long),
                map: $scope.map,
                label: (i + 1) + ""
              });
            }

          })
          .catch(function(error) {
            console.log("Error has occured: " + error)
          })

      };


      $scope.getOcrResult = function() {
        let file = $scope.jpegFile;
        $scope.isBusy = true;
        uploadService.uploadFileToUrl(file[0], postOcrUrl, api_key_ocr)
          .then(function(responce) {

            let resultArrRaw = responce.data.ParsedResults[0].ParsedText.split("\n");
            let resultArr = [];
            angular.forEach(resultArrRaw, function(addr) {
              if (addr.length > 20) {
                resultArr.push(addr);
              }
            });
            return uploadService.getGeoLocation(resultArr);

          })
        // let resultArr = ["2128 Rue de Bordeaux Vaudreuil-Dorion QC J7V 0L2 CA", "6 place du lac Vaudreuil-Dorion QC J7V 0G8 CA", "2728 rue Maurice-Duplessis Vaudreuil-Dorion QC J7V 8P5 CA"]
        //uploadService.getGeoLocation(resultArr)

      };


      $scope.initialize = function() {
        $scope.mapOptions = {
          zoom: 12,
          center: new google.maps.LatLng(45.391018, -74.036877)
        };
        $scope.map = new google.maps.Map(document.getElementById('googleMap'), $scope.mapOptions);
      }

      $scope.loadScript = function() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCMZ73swsdvxLEWKVT33CBJSzsIpQrkTSg&callback=initialize';
        document.body.appendChild(script);
        setTimeout(function() {
          $scope.initialize();
        }, 500);
      }


    }
  ]);
})();
