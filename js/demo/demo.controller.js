(function(angular, undefined) {
  function DemoController() {
    this.files = [];
  }
  DemoController.prototype = {
    onFileReject: function(detail) {
      alert('onFileReject');
    },
    onUploadBefore: function(detail) {
      console.log('onUploadBefore');
    },
    onUploadError: function(detail) {
      console.log('onUploadError');
    },
    onUploadProgress: function(detail) {
      console.log('onUploadProgress');
    },
    onUploadResponse: function(detail) {
      console.log('onUploadResponse');
    },
    onUploadRequest: function(detail) {
      console.log('onUploadRequest');
    },
    onUploadStart: function(detail) {
      console.log('onUploadStart');
    },
    onUploadSuccess: function(detail) {
      console.log('onUploadSuccess');
    },
  };
  DemoController.nameToken = 'DemoController';
  angular
    .module('demoApp')
    .controller(DemoController.nameToken, DemoController);
})(angular);
