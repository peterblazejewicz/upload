(function(angular, undefined) {
  function DemoController() {
    this.files = [
      {
        name: 'Don Quixote.pdf',
        progress: 50,
        complete: false,
        uploading: true,
        held: false,
        status: 'Uploading',
      },
      { name: 'Hamlet.pdf', progress: 100, complete: false, held: false },
      {
        name: 'Romeo and Juliet.pdf',
        progress: 100,
        complete: true,
        held: false,
      },
    ];
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
