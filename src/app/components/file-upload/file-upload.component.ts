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

  @Input() currentPhoto = 'assets/profile.png';

  /**
  * Emits Array<DATA_UPLOAD>
  */
  @Output() uploadDone = new EventEmitter<Array<DATA_UPLOAD>>();


  previewList = []; // raw images
  thumbnailUrls = [];
  uploadList: Array<DATA_UPLOAD> = [];
  loader = false;
  constructor(private fire: FireService, private lib: LibService ) { }

  ngOnInit() {
    if (this.fire.user.isLogout) {
      this.lib.openHomePage();
    }
    this.previewList.push(this.currentPhoto);
  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['currentPhoto']) {
        if (!this.allowMultipleFiles) {
          this.previewList = [];
        }
        this.previewList.push(this.currentPhoto);
        console.log('current photo changes');
    }
}

  onChangeFile(e) {
    this.loader = true;
    const files: FileList = e.target.files;
    if (files.length === 0) {
      return false;
    }

    const file: File = files[0];
    if (!this.allowMultipleFiles) {
      this.previewList.shift();
    }
    this.uploadFile(file);

  }

  private uploadFile(file: File) {
    this.loader = true;
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
        upload.url = uploadTask.snapshot.downloadURL;
        upload.fullPath = fileRef.fullPath;
        upload.name = uploadTask.snapshot.metadata.name;


        if (!this.allowMultipleFiles) {
          this.uploadList = [];
          this.previewList = [];
        }
        this.uploadList.push(upload);
        this.loader = false;
        // this.renderFile(file);
        closeUploadTask();
        this.uploadDone.emit(this.uploadList);
        /**
        * Delete older files if needed.
        */
        // if (this.deleteOldFiles) {
        //   if (this.deleteOldFiles.length) {
        //     for (const deleteOldFiles of this.deleteOldFiles) {
        //       if (deleteOldFiles.url) {
        //         this.fire.data.delete(deleteOldFiles).catch(e => alert(e.message));
        //       }
        //     }
        //     this.deleteOldFiles.splice(0, this.deleteOldFiles.length);
        //     console.log(this.deleteOldFiles);
        //   }

        // }
      });
  }

  // displayThumbnail() {
  //   this.fire.user.listen((user: USER) => {
  //     if (user.profilePhoto.thumbnailUrl) {
  //       this.currentPhoto = user.profilePhoto.thumbnailUrl;
  //     }
  //   });
  // }

  private renderFile(file) {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => {
      if (this.previewList.length > 0 && !this.allowMultipleFiles) {
        this.previewList.shift();
      }
      this.previewList.push(event.target['result']);
    };
    reader.readAsDataURL(file);
  }
}
