import { Component, OnInit } from '@angular/core';
import { BusyService } from '@remult/angular';
import { Remult } from 'remult';
import { DialogService } from '../common/popup/dialog';
import { User } from '../users/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mobile = ''
  constructor(public remult: Remult, private dialog: DialogService) { }

  async ngOnInit() {
    if(this.remult.authenticated() && this.remult.user.roles.length === 0) {
      this.mobile = (await this.remult.repo(User).findId(this.remult.user.id)).mobile
    }
  }

  userNotAllowedYet(){
    return this.remult.authenticated() && this.remult.user.roles.length === 0
  }

  showMessage() {
    let result = ''
    if (this.remult.user.roles.length === 0) {
      result = 'בהמתנה לאישור הרשמתך לתוכנית'
      result += '\n'
      result += 'הודעה תשלח למספר ' + ' 052- ' + ' כאשר יתקבל אישור'
      result += '\n'
      result += 'לפרטים ניתן לשלוח ווטסאפ למספר ' + ' 053-help ' + ' או למייל'
    }
    return result
  }

  now() {
    return new Date()
  }

  refresh() {
    // this.busy.startBusyWithProgress()
    this.dialog.info('בודק אם אושרת')
    window?.location?.reload()
  }

}
