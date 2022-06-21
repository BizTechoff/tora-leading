import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public remult: Remult) { }

  ngOnInit() {
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

}
