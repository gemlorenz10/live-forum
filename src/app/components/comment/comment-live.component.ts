import { Component, Input, OnInit, OnDestroy, NgZone, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FireService, POST, COMMENT } from '../../modules/firelibrary/core';



@Component({
    selector: 'app-comment-live',
    templateUrl: './comment-live.component.html',
    styleUrls: ['./comment-live.component.scss']
})
export class CommentLiveComponent implements OnInit, OnDestroy {

    @Input() post: POST = {};

    @ViewChild('chat') set chatElement(content: ElementRef) {
        if (content) {
            setTimeout(() => {
                this.scrollHeight = content.nativeElement['scrollHeight'];
            }, 10);
        }
    }
    scrollHeight; // Height of the comment live box
    comment = <COMMENT>{};
    loader = {
        creating: false,
        commentList: false
    };

    constructor(
        public ngZone: NgZone,
        public fire: FireService
    ) {
    }
    ngOnInit() {
        if (!this.post.id) {
            console.error('Post ID is empty. Something is wrong.');
            return;
        }
        this.loader.commentList = true;
        this.fire.comment.load(this.post.id).then(comments => {
            console.log(`comments: `, comments);
            this.loader.commentList = false;
            this.initComment();
            setTimeout(() => this.ngZone.run(() => {}), 2000);
        }).catch(e => alert(e.message));
    }

    ngAfterViewinit() {
        this.initComment();
    }

    ngOnDestroy() {
        this.fire.comment.destory(this.post);
        this.fire.comment.commentIds[this.post.id] = []; // clear commentIds
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
        this.comment.postId = this.post.id;
        this.comment.parentId = '';
        this.loader.creating = true;
        this.fire.comment.create(this.comment).then(re => {
            this.initComment();
            this.loader.creating = false;
        }).catch(e => {
            this.loader.creating = false;
            alert(e.message);
        });
        return false;
    }

}
