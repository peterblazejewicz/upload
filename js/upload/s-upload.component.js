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
      this.formDataName = this.formDataName || 'file';
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
      this.$fileInput.off('change');
      this.watchers.forEach(function(unwatch) {
        unwatch();
      });
      this.watchers = null;
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
      this.$scope.$apply(
        function() {
          this._addFiles($event.target.files);
        }.bind(this),
      );
    },

    _onFileAbort: function(detail) {
      this._abortFileUpload(detail.file);
    },

    _onFileRemove: function(detail) {
      this._removeFile(detail.file);
    },

    _onFileRetry: function(detail) {},

    _onFileStart: function(detail) {
      this._uploadFile(detail.file);
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
      if (!this.noAuto) {
        this._uploadFile(file);
      }
    },

    _abortFileUpload: function(file) {
      this.onUploadAbort &&
        this.onUploadAbort({
          detail: { file, xhr: file.xhr },
        });
      file.abort = true;
      if (file.xhr) {
        file.xhr.abort();
      }
    },

    _configureXhr: function(xhr) {
      if (typeof this.headers == 'string') {
        try {
          this.headers = JSON.parse(this.headers);
        } catch (e) {
          this.headers = undefined;
        }
      }
      for (var key in this.headers) {
        xhr.setRequestHeader(key, this.headers[key]);
      }
      if (this.timeout) {
        xhr.timeout = this.timeout;
      }
      xhr.withCredentials = this.withCredentials;
    },

    _createXhr: function() {
      return new XMLHttpRequest();
    },

    _formatFileProgress: function(file) {
      return (
        file.totalStr +
        ': ' +
        file.progress +
        '% (' +
        (file.loaded > 0
          ? this.i18n.uploading.remainingTime.prefix + file.remainingStr
          : this.i18n.uploading.remainingTime.unknown) +
        ')'
      );
    },

    _formatSize: function(bytes) {
      if (typeof this.i18n.formatSize === 'function') {
        return this.i18n.formatSize(bytes);
      }

      // https://wiki.ubuntu.com/UnitsPolicy
      const base = this.i18n.units.sizeBase || 1000;
      const unit = ~~(Math.log(bytes) / Math.log(base));
      const dec = Math.max(0, Math.min(3, unit - 1));
      const size = parseFloat((bytes / Math.pow(base, unit)).toFixed(dec));
      return size + ' ' + this.i18n.units.size[unit];
    },

    _formatTime: function(seconds, split) {
      if (typeof this.i18n.formatTime === 'function') {
        return this.i18n.formatTime(seconds, split);
      }

      // Fill HH:MM:SS with leading zeros
      while (split.length < 3) {
        split.push(0);
      }

      return split
        .reverse()
        .map(number => {
          return (number < 10 ? '0' : '') + number;
        })
        .join(':');
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

    _removeFile: function(file) {
      this.files.splice(this.files.indexOf(file), 1);
    },

    _setStatus: function(file, total, loaded, elapsed) {
      file.elapsed = elapsed;
      file.elapsedStr = this._formatTime(
        file.elapsed,
        this._splitTimeByUnits(file.elapsed),
      );
      file.remaining = Math.ceil(elapsed * (total / loaded - 1));
      file.remainingStr = this._formatTime(
        file.remaining,
        this._splitTimeByUnits(file.remaining),
      );
      file.speed = ~~(total / elapsed / 1024);
      file.totalStr = this._formatSize(total);
      file.loadedStr = this._formatSize(loaded);
      file.status = this._formatFileProgress(file);
    },

    _splitTimeByUnits: function(time) {
      const unitSizes = [60, 60, 24, Infinity];
      const timeValues = [0];

      for (var i = 0; i < unitSizes.length && time > 0; i++) {
        timeValues[i] = time % unitSizes[i];
        time = Math.floor(time / unitSizes[i]);
      }

      return timeValues;
    },

    _uploadFile: function(file) {
      if (file.uploading) {
        return;
      }
      var ini = Date.now();
      var xhr = (file.xhr = this._createXhr(file));
      var stalledId, last;
      // onprogress is called always after onreadystatechange
      xhr.upload.onprogress = e => {
        this.$scope.$applyAsync(function() {
          clearTimeout(stalledId);
          last = Date.now();
          var elapsed = (last - ini) / 1000;
          var loaded = e.loaded,
            total = e.total,
            progress = ~~((loaded / total) * 100);
          file.loaded = loaded;
          file.progress = progress;
          file.indeterminate = loaded <= 0 || loaded >= total;
          if (file.error) {
            file.indeterminate = file.status = undefined;
          } else if (!file.abort) {
            if (progress < 100) {
              this._setStatus(file, total, loaded, elapsed);
              stalledId = setTimeout(() => {
                file.status = this.i18n.uploading.status.stalled;
              }, 2000);
            } else {
              file.loadedStr = file.totalStr;
              file.status = this.i18n.uploading.status.processing;
              file.uploading = false;
            }
          }
          if (this.onUploadProgress) {
            this.onUploadProgress({
              detail: { file, xhr },
            });
          }
        });
      };

      // More reliable than xhr.onload
      xhr.onreadystatechange = () => {
        this.$scope.$applyAsync(function() {
          if (xhr.readyState == 4) {
            clearTimeout(stalledId);
            file.indeterminate = file.uploading = false;
            if (file.abort) {
              return;
            }
            file.status = '';
            // Custom listener can modify the default behavior either
            // preventing default, changing the xhr, or setting the file error
            this.onUploadReponse &&
              this.onUploadReponse({
                detail: { file, xhr },
              });
            // TODO implementation
            // if (!evt) {
            //   return;
            // }
            if (xhr.status === 0) {
              file.error = this.i18n.uploading.error.serverUnavailable;
            } else if (xhr.status >= 500) {
              file.error = this.i18n.uploading.error.unexpectedServerError;
            } else if (xhr.status >= 400) {
              file.error = this.i18n.uploading.error.forbidden;
            }
            file.complete = !file.error;
            if (file.error) {
              this.onUploadError &&
                this.onUploadError({
                  detail: { file, xhr },
                });
            } else {
              this.onUploadSuccess &&
                this.onUploadSuccess({
                  detail: { file, xhr },
                });
            }
          }
        });
      };

      var formData = new FormData();

      file.uploadTarget = this.target || '';
      file.formDataName = this.formDataName;
      this.onUploadBefore &&
        this.onUploadBefore({
          detail: { file, xhr },
        });
      // TODO cancellation
      // if (!evt) {
      //   return;
      // }
      formData.append(file.formDataName, file, file.name);
      xhr.open(this.method, file.uploadTarget, true);
      this._configureXhr(xhr);

      file.status = this.i18n.uploading.status.connecting;
      file.uploading = file.indeterminate = true;
      file.complete = file.abort = file.error = file.held = false;

      xhr.upload.onloadstart = () => {
        this.$scope.$applyAsync(function() {
          this.onUploadStart &&
            this.onUploadStart({
              detail: { file, xhr },
            });
        });
      };

      // Custom listener could modify the xhr just before sending it
      // preventing default
      this.onUploadRequest &&
        this.onUploadRequest({
          detail: { file, xhr, formData },
        });
      // TODO cancellation
      // if (uploadEvt) {
      //   xhr.send(formData);
      // }
      xhr.send(formData);
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
      accept: '<',
      files: '<',
      formDataName: '<',
      maxFiles: '<',
      maxFileSize: '<',
      method: '<',
      target: '<',
      timeout: '<',
      onFileReject: '&',
      onUploadBefore: '&',
      onUploadError: '&',
      onUploadProgress: '&',
      onUploadReponse: '&',
      onUploadRequest: '&',
      onUploadStart: '&',
      onUploadSuccess: '&',
    },
    controller: UploadController,
    controllerAs: 'upload',
  });
})(angular);
