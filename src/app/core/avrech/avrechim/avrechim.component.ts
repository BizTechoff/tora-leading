import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { DialogService } from '../../../common/popup/dialog';
import { InputAreaComponent } from '../../../common/popup/input-area/input-area.component';
import { terms } from '../../../terms';
import { User } from '../../../users/user';

@Component({
  selector: 'app-avrechim',
  templateUrl: './avrechim.component.html',
  styleUrls: ['./avrechim.component.scss']
})
export class AvrechimComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<AvrechimComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש אברך' })
  search = ''

  users = new GridSettings(this.remult.repo(User), {
    where: { avrech: true },
    allowCrud: false,
    numOfColumnsInGrid: 10,

    // orderBy: { name: "asc" },
    rowsInPage: 25,

    columnSettings: users => [
      users.name,
      users.yeshiva,
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
        name: 'עדכון אברך',
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
      title = 'עדכון אברך'
      u = await this.remult.repo(User).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת אברך'
      u = this.remult.repo(User).create()
      u.avrech = true
    }

    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [
          [{field:u.$.name, caption:'שם פרטי'},
          u.$.fname],
          u.$.yeshiva,
          // u.$.marriageDate,
          // u.$.missionLocation,
          // u.$.missionDate,
          u.$.email,
          u.$.mobile,
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
