import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { DialogService } from '../common/popup/dialog';
import { InputAreaComponent } from '../common/popup/input-area/input-area.component';
import { terms } from '../terms';
import { User } from './user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<UsersComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש משתמש' })
  search = ''

  users = new GridSettings(this.remult.repo(User), {
    allowCrud: false,
    numOfColumnsInGrid: 10,

    // orderBy: { name: "asc" },
    rowsInPage: 25,

    columnSettings: users => [
      users.name,
      users.mobile,
      users.admin,
      users.manager,
      users.shluch,
      users.avrech//,
      // users.email,
      // users.phone
    ],
    gridButtons: [{
      icon: 'refresh',
      textInMenu: () => 'רענן',
      click: async () => await this.refresh()
    }],
    rowButtons: [
      {
        icon: 'edit',
        name: 'עדכון משתמש',
        click: async (row) => await this.upsertUser(row?.id)
      },
      {
        icon: 'password',
        name: terms.resetPassword,
        click: async () => {
          if (await this.dialog.yesNoQuestion(terms.passwordDeleteConfirmOf + this.users.currentRow.name)) {
            await this.users.currentRow.resetPassword();
            this.dialog.info(terms.passwordDeletedSuccessful);
          };
        }
      },
      {
        icon: 'send_to_mobile',
        name: terms.sendSigninDetails,
        click: async () => {
          let yes = await this.dialog.yesNoQuestion('לשלוח פרטי התחברות ל: ' + this.users.currentRow.name)
          if (yes) {
            this.dialog.info('פרטי התחברות נשלחו בהצלחה');
          }
        }
      },
      {
        icon: 'delete',
        name: 'הסר משתמש',
        click: async (row) => await this.deleteUser(row.id, row.name)
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

  async deleteUser(id = '', name = '') {
    let yes = await this.dialog.yesNoQuestion('להסיר את המשתמש ' + name)
    if (yes) {
      await this.remult.repo(User).delete(id)
      await this.refresh()
    }
  }

  async upsertUser(id = '') {
    let u: User
    let title = ''
    if (id?.trim().length) {
      title = 'עדכון משתמש'
      u = await this.remult.repo(User).findId(id, { useCache: false })
      if (!u) {
        throw `Error user id: '${id}'`
      }
    }
    else {
      title = 'הוספת משתמש'
      u = this.remult.repo(User).create()
    }
 
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: title,
        fields: () => [
          u.$.name,
          u.$.mobile,
          u.$.admin,
          u.$.manager,
          u.$.shluch,
          u.$.avrech
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
