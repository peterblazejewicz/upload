(function(angular, undefined) {
  function DemoController() {
    this.files = [
      {
        name: 'Don Quixote.pdf',
        progress: 50,
        complete: true,
        held: true,
        status: 'info status',
        error: 'info error',
      },
      { name: 'Hamlet.pdf', progress: 100, complete: false, held: false },
    ];
  }
  DemoController.nameToken = 'DemoController';
  angular
    .module('demoApp')
    .controller(DemoController.nameToken, DemoController);
})(angular);
