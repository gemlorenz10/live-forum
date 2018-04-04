import { ALERT_TIMEOUT } from './../../../settings/settings';
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
    if (this.response.code === null) {
      this.type = 'success';
      this.show = true;
    } else {
      this.type = 'danger';
      this.code = this.response.code;
      this.message = (this.message) ? this.message : this.response.message || 'No message passed.';
      this.show = true;
    }
    setTimeout(() => {
      this.show = false;
    }, ALERT_TIMEOUT);
  }

}
