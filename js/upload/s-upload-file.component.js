/**
 * This work contains derivative code of Vaadin's file upload
 * licensed under Apache License 2.0
 * https://github.com/vaadin/vaadin-upload/blob/master/LICENSE
 */
(function(angular, undefined) {
  function UploadFileController($elem, $scope) {
    this.$elem = $elem;
    this.$scope = $scope;
    this.watchers = [];
  }
  UploadFileController.$inject = ['$element', '$scope'];
  UploadFileController.prototype = {
    $onInit: function() {
      var self = this;
      this.watchers.push(
        this.$scope.$watch('$ctrl.file.abort', function(newValue, oldValue) {
          self._fileAborted(newValue);
        }),
      );
      this.watchers.push(
        this.$scope.$watch('$ctrl.file.error', function(newValue, oldValue) {
          self._toggleHostAttribute(newValue, 'error');
        }),
      );
      this.watchers.push(
        this.$scope.$watch('$ctrl.file.indeterminate', function(
          newValue,
          oldValue,
        ) {
          self._toggleHostAttribute(newValue, 'indeterminate');
        }),
      );
      this.watchers.push(
        this.$scope.$watch('$ctrl.file.abort', function(newValue, oldValue) {
          self._toggleHostAttribute(newValue, 'error');
        }),
      );
      this.watchers.push(
        this.$scope.$watch('$ctrl.file.complete', function(newValue, oldValue) {
          self._toggleHostAttribute(newValue, 'complete');
        }),
      );
    },

    $onDestroy: function() {
      this.watchers.forEach(function(unwatch) {
        unwatch();
      });
      this.watches = null;
    },

    _fileAborted: function(abort) {
      if (abort) {
        this._remove();
      }
    },
    _remove: function() {
      if (this.onFileAbort) {
        this.onFileAbort({
          detail: {
            file: this.file,
          },
        });
      }
    },

    _toggleHostAttribute: function(value, attributeName) {
      var add = Boolean(value);
      if (add) {
        this.$elem.attr(attributeName, '');
      } else {
        this.$elem.removeAttr(attributeName);
      }
    },

    _onFileRetry: function($event) {
      if (this.onFileRetry) {
        this.onFileRetry({
          detail: {
            file: this.file,
          },
        });
      }
    },
    _onFileAbort: function($event) {
      if (this.onFileAbort) {
        this.onFileAbort({
          detail: {
            file: this.file,
          },
        });
      }
    },
    _onFileRemove: function($event) {
      if (this.onFileRemove) {
        this.onFileRemove({
          detail: {
            file: this.file,
          },
        });
      }
    },
    _onFileStart: function($event) {
      if (this.onFileStart) {
        this.onFileStart({
          detail: {
            file: this.file,
          },
        });
      }
    },
  };
  UploadFileController.tokenName = 'sUploadFile';
  angular.module('sUploadModule').component(UploadFileController.tokenName, {
    templateUrl: 'js/upload/s-upload-file.template.html',
    bindings: {
      file: '<',
      onFileRetry: '&',
      onFileAbort: '&',
      onFileRemove: '&',
      onFileStart: '&',
    },
    controller: UploadFileController,
    controllerAs: '$ctrl',
  });
})(angular);
