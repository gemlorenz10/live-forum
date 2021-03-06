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
    @ViewChild('input') chatInput: ElementRef;

    scrollTop; //
    comment = <COMMENT>{};
    loader = {
        creating: false,
        commentList: false
    };

    //
    prevUid = '';
    constructor(
        public ngZone: NgZone,
        public fire: FireService,
        public lib: LibService
    ) {
    }
    setPrevUid(uid) {
        this.prevUid = uid;
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

        this.fire.comment.created.subscribe( () => {
            this.scrollTop = this.chatContainer.nativeElement['scrollHeight'];
            this.chatInput.nativeElement.focus();
        });
        this.fire.comment.updated.subscribe( () => {
            this.scrollTop = this.chatContainer.nativeElement['scrollHeight'];
            this.chatInput.nativeElement.focus();
        });
    }

    ngAfterViewinit() {
        this.initComment();
    }

    ngOnDestroy() {
        this.fire.comment.destory(this.post);
        this.fire.comment.commentIds[this.post.id] = []; // clear commentIds
    }



    initComment() {
        this.comment = { id: this.fire.comment.getId(), content: '', date: '', data: [] };
        this.chatInput.nativeElement.focus();
        console.log('Chat Input', this.chatInput);
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

        if (!this.comment.content) {
            this.comment.content = '';
        }

        if ( this.comment.content || this.comment.data.length > 0 ) {

            this.insertComment();

        } else {
            alert('Comment has no content.');
            return false;
        }
    }


    insertComment() {
        this.comment.postId = this.post.id;
        this.comment.parentId = '';
        if (! this.comment.content) {
            this.comment.content = '';
        }
        this.loader.creating = true;
        this.fire.comment.create(this.comment)
        .then(re => {
            this.initComment();
            this.loader.creating = false;
        }).catch(e => {

            this.loader.creating = false;
            alert(e.message);
        });
    }

    onUploadDone(data) {
        this.comment.data.push(data);
        this.loader.creating = false;
    }

    onCommand() {

    }
}
