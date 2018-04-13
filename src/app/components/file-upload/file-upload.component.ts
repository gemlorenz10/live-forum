import { DATA_UPLOAD, USER, USER_CREATE } from './../../modules/firelibrary/providers/etc/interface';
import { LibService } from './../../providers/lib.service';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, OnDestroy } from '@angular/core';
import { FireService } from '../../modules/firelibrary/core';

import * as firebase from 'firebase';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})

/**
* Uploads data into firebase storage.
*
* It waits for the @`Input data` to be updated before emiting done.
*
* Therefore the parent component should listen to data pdates then pass it on `@Input data`.
*
*/
export class FileUploadComponent implements OnInit, OnDestroy, OnChanges {

  /**
  * Path to firebase storage.
  */
  @Input() pathToStorage;
  /**
  * Boolean `true` to allow. Otherwise false
  */
  @Input() allowMultipleFiles: boolean;

  /**
  * Deletes older files in the storage.
  *
  * This is done when you don't need multiple file saved. Use case `avatar` or `profile-pic`.
  */
  @Input() deleteOldFiles: Array<DATA_UPLOAD>;

  /**
  * `true` if will wait for thumbnail before emitting. Otherwise just display raw.
  */
  // @Input() waitForThumbnail: boolean;

  /**
  * The data to be deleted
  */
  @Input() currentData: DATA_UPLOAD;

  /**
  * Emit if upload is starts
  */
  @Output() uploadStart = new EventEmitter();
  /**
  * Emits Array<DATA_UPLOAD>
  */
  @Output() uploadDone = new EventEmitter<Array<DATA_UPLOAD>>();

  loader: boolean;
  uploadList: Array<DATA_UPLOAD> = [];
  // oldFile = <DATA_UPLOAD>{};

  constructor(private fire: FireService, private lib: LibService ) { }

  ngOnInit() {

    if (this.fire.user.isLogout) {
      this.lib.openHomePage();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
  }

  onChangeFile(e) {
    this.loader = true;
    const files: FileList = e.target.files;

    if (files.length === 0) {
      alert('No data to upload');
    }

    const file: File = files[0];
    if (!this.allowMultipleFiles) {
      this.uploadFile(file);
    }

  }

  uploadFile(file: File) {
    this.loader = true;
    this.uploadStart.emit();

    const upload: DATA_UPLOAD = { name: '' };
    const user = <USER>{};
    const fileRef = this.fire.data.getDataRef(this.pathToStorage, file);
    const uploadTask = fileRef.put(file);

    const closeUploadTask = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      // Upload process
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        console.log('Upload State', Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100) + '%');
      },
      // Upload error
      (err) => {
        console.error('Upload Error', err);
        if ( err.message ) {
          alert(err.message);
        }
        this.loader = false;
        closeUploadTask();
      },
      // Upload success
      () => {
        upload.url = uploadTask.snapshot.downloadURL;
        upload.fullPath = fileRef.fullPath;
        upload.name = uploadTask.snapshot.metadata.name;
        this.updateUploadList(upload);
        /**
        * Delete older files if needed.
        */
        if (this.currentData && !this.allowMultipleFiles && this.deleteOldFiles && this.currentData.fullPath !== upload.fullPath) {
          this.fire.data.delete(this.currentData)
          .then(a => {
            console.log('Old file deleted.');
          })
          .catch(e => {
            alert('Error deleting old file' + e.message);
            console.error('Error on delete:', e);
          });
        }

        /**
         * Listen to user changes specifically to thumbnailUrl
         */
        // this.listenToUserDoc();
        console.log('UPLOAD IN FILE', upload);
        this.emitDone();
        closeUploadTask();
      });
    }

    updateUploadList(image) {
      if (!this.allowMultipleFiles) {
        this.uploadList = [];
      }
      this.uploadList.push(image);
    }

    emitDone() {
      this.uploadDone.emit(this.uploadList);
      this.loader = false;
    }
  }

