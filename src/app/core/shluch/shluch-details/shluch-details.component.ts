import { Component, OnInit } from '@angular/core';
import { Remult } from 'remult';
import { User } from '../../../users/user';

@Component({
  selector: 'app-shluch-details',
  templateUrl: './shluch-details.component.html',
  styleUrls: ['./shluch-details.component.scss']
})
export class ShluchDetailsComponent implements OnInit {

  shluch!: User
  constructor(private remult: Remult) { }

  async ngOnInit(): Promise<void> {
    this.shluch = await this.remult.repo(User).findId(this.remult.user.id)
    if (!this.shluch) {
      throw `Error on read user id: '${this.remult.user.id}'`
    }
  }

}
