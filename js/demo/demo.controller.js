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
      { name: 'Romeo and Juliet.pdf', progress: 100, complete: true, held: false },
    ];
  }
  DemoController.nameToken = 'DemoController';
  angular
    .module('demoApp')
    .controller(DemoController.nameToken, DemoController);
})(angular);
