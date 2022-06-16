import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { DialogService } from '../../../common/popup/dialog';
import { terms } from '../../../terms';
import { User } from '../../../users/user';

@Component({
  selector: 'app-shluch-details',
  templateUrl: './shluch-details.component.html',
  styleUrls: ['./shluch-details.component.scss']
})
export class ShluchDetailsComponent implements OnInit {

  shluch!: User
  constructor(private remult: Remult, private dialog:DialogService) { }
  terms = terms

  async ngOnInit(): Promise<void> {
    this.shluch = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false })
    if (!this.shluch) {
      throw `Error on read user id: '${this.remult.user.id}'`
    }
  }

  async save() {
    await this.shluch.save()
    await this.dialog.info('פרטיך עודכנו בהצלחה')
  }

}
