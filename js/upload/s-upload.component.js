/**
 * This work contains derivative code of Vaadin's file upload
 * licensed under Apache License 2.0
 * https://github.com/vaadin/vaadin-upload/blob/master/LICENSE
 */
(function(angular, undefined) {
  function UploadController($elem, i18n, $scope, $location) {
    this.$elem = $elem;
    this.i18n = i18n;
    this.$scope = $scope;
    this.$location = $location;
    this.maxFilesReached = false;
    this.watchers = [];
  }
  UploadController.prototype = {
    $onInit: function() {
      // defaults
      this.accept = this.accept || '';
      this.maxFiles = isNaN(this.maxFiles) ? Infinity : this.maxFiles;
      this.method = this.method || 'POST';
      this.noAuto = angular.isDefined(this.noAuto) ? this.noAuto : false;
      this.target = this.target || '';
      this.timeout = isNaN(this.timeout) ? 0 : this.timeout;
      //
      this.watchers.push(
        this.$scope.$watchCollection(
          function() {
            return this.files;
          },
          function(newValue, oldValue) {
            if (this.files) {
              this.maxFilesReached = this.__maxFilesAdded(
                this.maxFiles,
                this.files.lenght,
              );
            }
          },
        ),
      );
    },
    $postLink: function() {
      this.$fileInput = this.$elem.find('input[type="file"]');
      this._updateMultiple();
      //
      this.$elem.on('dragover', this._onDragover.bind(this));
      this.$elem.on('dragleave', this._onDragleave.bind(this));
      this.$elem.on('drop', this._onDrop.bind(this));
      this.$fileInput.on('change', this._onFileInputChange.bind(this));
    },
    $onDestroy: function() {
      this.$elem.off('dragover');
      this.$elem.off('dragleave');
      this.$elem.off('drop');
      this.$elem.off('change');
      this.watchers.forEach(function(unwatch) {
        unwatch();
      });
    },
    $onChanges: function(changes) {
      if (changes.maxFiles) {
        // multiple attribute
        this._updateMultiple();
      }
    },

    _onDragover: function(event) {
      console.log(event.type);
    },
    _onDragleave: function(event) {
      console.log(event.type);
    },
    _onDrop: function(event) {
      console.log(event.type);
    },

    _onAddFilesClick: function($event) {
      if (this.maxFilesReached) {
        return;
      }
      this.$fileInput.val('');
      this.$fileInput.click();
    },

    _onFileInputChange: function($event) {
      this._addFiles($event.target.files);
    },

    _onFileAbort: function(detail) {
      console.log(detail);
    },

    _onFileRemove: function(detail) {
      console.log(detail);
    },

    _onFileRetry: function(detail) {
      console.log(detail);
    },

    _onFileStart: function(detail) {
      console.log(detail);
    },

    _addFiles: function(files) {
      Array.prototype.forEach.call(files, this._addFile.bind(this));
    },

    _addFile: function(file) {
      if (this.maxFilesReached) {
        if (this.onFileReject) {
          this.onFileReject({
            detail: { file, error: this.i18n.tooManyFiles },
          });
        }
        return;
      }
      if (this.maxFileSize >= 0 && file.size > this.maxFileSize) {
        if (this.onFileReject) {
          this.onFileReject({
            detail: { file, error: this.i18n.error.fileIsTooBig },
          });
        }
        return;
      }
      const fileExt = file.name.match(/\.[^\.]*$|$/)[0];
      const re = new RegExp(
        '^(' +
          this.accept.replace(/[, ]+/g, '|').replace(/\/\*/g, '/.*') +
          ')$',
        'i',
      );
      if (this.accept && !(re.test(file.type) || re.test(fileExt))) {
        if (this.onFileReject) {
          this.onFileReject({
            detail: { file, error: this.i18n.error.incorrectFileType },
          });
        }
        return;
      }
      file.loaded = 0;
      file.held = true;
      file.status = this.i18n.uploading.status.held;
      this.files.unshift(file);
      this.$scope.$apply();
      if (!this.noAuto) {
        this._uploadFile(file);
      }
    },

    _isMultiple: function(maxFiles) {
      return maxFiles != 1;
    },

    _updateMultiple: function() {
      if (!this.$fileInput) return;
      if (this._isMultiple(this.maxFiles)) {
        this.$fileInput.attr('multiple', '');
      } else {
        this.$fileInput.removeAttr('multiple');
      }
    },

    _maxFilesAdded: function(maxFiles, numFiles) {
      return maxFiles >= 0 && numFiles >= maxFiles;
    },

    _uploadFile: function(file) {
      if (file.uploading) {
        return;
      }
    },
  };
  UploadController.$inject = [
    '$element',
    'sUploadModule.i18n',
    '$scope',
    '$location',
  ];
  angular.module('sUploadModule').component('sUpload', {
    templateUrl: 'js/upload/s-upload.template.html',
    bindings: {
      files: '<',
      accept: '<',
      maxFiles: '<',
      maxFileSize: '<',
      method: '<',
      onFileReject: '&',
      target: '<',
      timeout: '<',
    },
    controller: UploadController,
    controllerAs: 'upload',
  });
})(angular);
