import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { DialogService } from '../../../common/popup/dialog';
import { InputAreaComponent } from '../../../common/popup/input-area/input-area.component';
import { terms } from '../../../terms';
import { User } from '../../../users/user';

@Component({
  selector: 'app-shluchim',
  templateUrl: './shluchim.component.html',
  styleUrls: ['./shluchim.component.scss']
})
export class ShluchimComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<ShluchimComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש משתמש' })
  search = ''

  users = new GridSettings(this.remult.repo(User), {
    where: { shluch: true },
    allowCrud: false,
    numOfColumnsInGrid: 10,

    // orderBy: { name: "asc" },
    rowsInPage: 25,

    columnSettings: users => [
      users.name,
      users.fname,
      users.mobile,
      users.email,
      users.phone
    ],
    gridButtons: [{
      icon: 'refresh',
      textInMenu: () => 'רענן',
      click: async () => await this.refresh()
    }],
    rowButtons: [
      {
        icon: 'edit',
        name: 'עדכון שליח',
        click: async (row) => await this.upsertUser(row?.id)
      }
    ],
    confirmDelete: async (h) => {
      return await this.dialog.confirmDelete(h.name)
    },
  });

  ngOnInit() {
  }

  async refresh() {
    await this.users.reloadData()
  }

  async upsertUser(id = '') {
    let u: User
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון שליח'
      u = await this.remult.repo(User).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת שליח'
      u = this.remult.repo(User).create()
      u.shluch = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [
          u.$.name,
          u.$.fname,
          u.$.mobile,
          u.$.marriageDate,
          u.$.missionLocation,
          u.$.missionDate,
          u.$.email,
          u.$.phone,
          u.$.remarks
        ],
        ok: async () => {
          await u.save()
        }
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      // await u.save()
      await this.refresh()
    }
  }

}
