(function(angular, undefined) {
  function UploadFileController() {}
  UploadFileController.tokenName = 'sUploadFile';
  angular.module('sUploadModule').component(UploadFileController.tokenName, {
    templateUrl: 's-upload-file.tpl',
    bindings: {
      file: '<',
    },
    controller: UploadFileController,
    controllerAs: '$ctrl',
  });
})(angular);
