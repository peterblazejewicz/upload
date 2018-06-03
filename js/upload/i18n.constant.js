/**
 * This work contains derivative code of Vaadin's file upload
 * licensed under Apache License 2.0
 * https://github.com/vaadin/vaadin-upload/blob/master/LICENSE
 */
(function(angular, undefined) {
  angular.module('sUploadModule').constant('sUploadModule.i18n', {
    dropFiles: {
      one: 'Drop file here',
      many: 'Drop files here',
    },
    addFiles: {
      one: 'Select File...',
      many: 'Upload Files...',
    },
    cancel: 'Cancel',
    error: {
      tooManyFiles: 'Too Many Files.',
      fileIsTooBig: 'File is Too Big.',
      incorrectFileType: 'Incorrect File Type.',
    },
    uploading: {
      status: {
        connecting: 'Connecting...',
        stalled: 'Stalled.',
        processing: 'Processing File...',
        held: 'Queued',
      },
      remainingTime: {
        prefix: 'remaining time: ',
        unknown: 'unknown remaining time',
      },
      error: {
        serverUnavailable: 'Server Unavailable',
        unexpectedServerError: 'Unexpected Server Error',
        forbidden: 'Forbidden',
      },
    },
    units: {
      size: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    },
  });
})(angular);
