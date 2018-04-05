import { Component, OnInit, Input } from '@angular/core';
import { RESPONSE } from '../../modules/firelibrary/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  /**
   * Response recieved by the app from firelibrary.
   */
  @Input() response: RESPONSE;
    /**
   * Message to be shown in the post
   */
  @Input() message: string;
  /**
   * Type of alert box to show
   * `success` or `danger`
   */
  type: string;
  /**
   * Tp
   */
  show = false;
  code: string;

  constructor() { }

  ngOnInit() {

  }

}
