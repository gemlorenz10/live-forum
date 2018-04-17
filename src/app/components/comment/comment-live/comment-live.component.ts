import { LibService } from './../../../providers/lib.service';
import { Component, Input, OnInit, OnDestroy, NgZone, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FireService, POST, COMMENT } from '../../../modules/firelibrary/core';
import { EventListener } from '@angular/core/src/debug/debug_node';
import { last } from '@angular/router/src/utils/collection';



@Component({
    selector: 'app-comment-live',
    templateUrl: './comment-live.component.html',
    styleUrls: ['./comment-live.component.scss']
})
export class CommentLiveComponent implements OnInit, OnDestroy {

    @Input() post: POST = {};

    @ViewChild('chat') chatContainer: ElementRef;

    scrollTop; //
    comment = <COMMENT>{};
    loader = {
        creating: false,
        commentList: false
    };

    constructor(
        public ngZone: NgZone,
        public fire: FireService,
        public lib: LibService
    ) {
    }
    ngOnInit() {
        if (!this.post.id) {
            console.error('Post ID is empty. Something is wrong.');
            return;
        }
        this.loader.commentList = true;
        this.fire.comment.load(this.post.id).then(comments => {
            // console.log(`comments: `, comments);
            this.loader.commentList = false;
            this.initComment();
            setTimeout(() => this.scrollTop = this.chatContainer.nativeElement['scrollHeight']);
            setTimeout(() => this.ngZone.run(() => {}), 2000);
        }).catch(e => alert(e.message));

        this.fire.comment.event.subscribe( e => {
            if (e === 'insert') {
                this.scrollTop = this.chatContainer.nativeElement['scrollHeight'];
            }
        });
    }

    ngAfterViewinit() {
        this.initComment();
    }

    ngOnDestroy() {
        this.fire.comment.destory(this.post);
        this.fire.comment.commentIds[this.post.id] = []; // clear commentIds
        this.fire.comment.event.unsubscribe();
    }



    initComment() {
        this.comment = { id: this.fire.comment.getId(), date: '', data: [] };

    }
    comments(id): COMMENT {
        return this.fire.comment.getComment(id);
    }

    isMyComment() {
        console.log('isMyCOmment=====>', this.comment.uid === this.fire.user.uid);
        return this.comment.uid === this.fire.user.uid;
    }
    get commentIds(): Array<string> {
        if (this.fire.comment.commentIds) {
            return this.fire.comment.commentIds[this.post.id]; // .reverse();
        }

    }

    /**
    * Creates a comment.
    * This is being invoked when user submits the comment form.
    *
    *
    */
    onSubmit(event: Event) {
        event.preventDefault();
        const idList = this.commentIds;

        if ( this.comment.content || this.comment.data.length > 0 ) {

            if ( idList && this.comments( idList[idList.length - 1]).deleted ) {
                idList.pop();
            }

            if ( idList && idList.length > 0 && this.comments( idList[idList.length - 1]).uid === this.fire.user.uid ) {
                this.loader.creating = true;
                this.comment.id = this.comments( idList[idList.length - 1]).id;
                this.comment.content =  this.comments( idList[idList.length - 1]).content  + ' ' + this.comment.content;

                if (this.comment.data && this.comment.data.length > 0) {
                    this.comment.data = this.comments( idList[idList.length - 1]).data.concat(this.comment.data);
                }

                this.fire.comment.edit(this.comment)
                .then(re => {
                    this.initComment();
                    this.loader.creating = false;
                }).catch(e => {
                    this.initComment();
                    this.loader.creating = false;
                    alert(e.message);
                });

            } else {
                this.insertComment();
            }

        } else {
            alert('Comment has no content.');
            return false;
        }
    }


    insertComment() {
        this.comment.postId = this.post.id;
        this.comment.parentId = '';
        this.loader.creating = true;
        this.fire.comment.create(this.comment)
        .then(re => {
            this.initComment();
            this.loader.creating = false;
        }).catch(e => {
            this.initComment();
            this.loader.creating = false;
            alert(e.message);
        });
    }

    onUploadDone(data) {
        this.comment.data.push(data);
        this.loader.creating = false;
    }
}
