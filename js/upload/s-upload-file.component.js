(function(angular, undefined) {
  function UploadFileController() {}
  UploadFileController.tokenName = 'sUploadFile';
  angular.module('sUploadModule').component(UploadFileController.tokenName, {
    templateUrl: 'js/upload/s-upload-file.template.html',
    bindings: {
      file: '<',
    },
    controller: UploadFileController,
    controllerAs: '$ctrl',
  });
})(angular);
