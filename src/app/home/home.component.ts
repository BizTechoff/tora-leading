import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { DialogService } from '../common/popup/dialog';
import { GlobalParam } from '../globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  allowToStart = false
  mobile = ''
  constructor(public remult: Remult, private dialog: DialogService) { }

  async ngOnInit() {
    // let u = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false })
    this.allowToStart = GlobalParam.allowToStart// u?.allowToStart ?? false
    console.log(11)
    if (!this.allowToStart) {
      console.log(22)
      this.mobile = u?.mobile
    }
  }

  registeredOk() {
    return this.allowToStart
    // return this.remult.authenticated() && this.remult.user.roles.length > 0
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
