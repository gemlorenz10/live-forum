import { DATA_UPLOAD, USER } from './../../modules/firelibrary/providers/etc/interface';
import { LibService } from './../../providers/lib.service';

import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { FireService } from '../../modules/firelibrary/core';

import * as firebase from 'firebase';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnChanges {

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
   * The data to be processed.
   */
  @Input() data: DATA_UPLOAD;
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
  oldFile = <DATA_UPLOAD>{};
  constructor(private fire: FireService, private lib: LibService ) { }

  ngOnInit() {
    if (this.fire.user.isLogout) {
      this.lib.openHomePage();
    }
    if (this.data && this.data.url && this.data.thumbnailUrl) {
      this.oldFile = this.data;
    }
    // console.log('Get old file on Init', this.oldFile);
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['data']) {
      // console.log('Data changes', this.data);
      if (!this.allowMultipleFiles) {
        this.oldFile = this.data;

      }

      // update photo preview array and uploadList array.
      // if (this.data.thumbnailUrl) {
      //   this.updateUploadList(this.data.thumbnailUrl);
      // } else if ( this.data.url ) {
      //   this.updateUploadList(this.data.url);
      // } else {
      //   console.log('No data yet.');
      // }
      this.emitDone();

    } else {
      this.emitDone();
      console.log('No changes on data');
    }


    // if (changes['oldFile']) {
    //   console.log('Old file changes', changes['oldFile']);
    // }

    // console.log('Changes on file upload', changes['data']);
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
    const fileRef = this.fire.data.getDataRef(this.pathToStorage, file);
    const uploadTask = fileRef.put(file);
    const closeUploadTask = uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => {
        console.log('Upload State', Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100) + '%');
      },
      (err) => {
        console.error('Upload Error', err);
        if ( err.message ) {
          alert(err.message);
        }
        this.loader = false;
        closeUploadTask();
      },
      () => {
        // console.log(this.oldFile)
        upload.url = uploadTask.snapshot.downloadURL;
        upload.fullPath = fileRef.fullPath;
        upload.name = uploadTask.snapshot.metadata.name;


        if (!this.allowMultipleFiles) {
          this.uploadList = [];
        }
        // this.loader = false;
        /**
        * Delete older files if needed.
        *
        */
        if (!this.allowMultipleFiles) {
          if (this.deleteOldFiles && this.oldFile.fullPath !== upload.fullPath) {
            // console.log('This is old file', this.oldFile);
            this.fire.data.delete(this.oldFile)
            .then(a => {
              console.log('Old file deleted.');
            })
            .catch(e => {
              alert(e.message);
              console.error('Error on delete:', e);
            });
          }
        }

        closeUploadTask();
      });
    }

    private updateUploadList(image) {
      if (!this.allowMultipleFiles) {
        this.uploadList = [];
      }
      this.uploadList.push(this.data);
    }

    private emitDone() {
      if ( this.updateUploadList.length === 0 ) {
        this.uploadDone.emit([]);
      } else {
        this.uploadDone.emit(this.uploadList);
      }
      this.loader = false;
    }

    // private renderFile(file) {
    //   const reader = new FileReader();
    //   reader.onload = (event: ProgressEvent) => {
    //     if (this.previewList.length > 0 && !this.allowMultipleFiles) {
    //       this.previewList.shift();
    //     }
    //     this.previewList.push(event.target['result']);
    //   };
    //   reader.readAsDataURL(file);
    // }
  }
