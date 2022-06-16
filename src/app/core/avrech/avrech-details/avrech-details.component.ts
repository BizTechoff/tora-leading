import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { terms } from '../../../terms';
import { User } from '../../../users/user';

@Component({
  selector: 'app-avrech-details',
  templateUrl: './avrech-details.component.html',
  styleUrls: ['./avrech-details.component.scss']
})
export class AvrechDetailsComponent implements OnInit {

  shluch!: User
  constructor(private remult: Remult) { }
  terms = terms

  async ngOnInit(): Promise<void> {
    this.shluch = await this.remult.repo(User).findId(this.remult.user.id)
    if (!this.shluch) {
      throw `Error on read user id: '${this.remult.user.id}'`
    }
  }

  async save() {
    await this.shluch.save()
  }

}
