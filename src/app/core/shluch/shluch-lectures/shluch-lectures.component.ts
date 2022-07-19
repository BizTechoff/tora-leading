import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { Fields, getFields, Remult } from 'remult';
import { InputAreaComponent } from '../../../common/popup/input-area/input-area.component';
import { terms } from '../../../terms';
import { User } from '../../../users/user';
import { Lecture } from '../../lecture/lecture';
import { LectureMonth } from '../../lecture/lectureMonth';

@Component({
  selector: 'app-shluch-lectures',
  templateUrl: './shluch-lectures.component.html',
  styleUrls: ['./shluch-lectures.component.scss']
})
export class ShluchLecturesComponent implements OnInit {

  lectures = [] as Lecture[]
  lecturesGrids: { id: string, grid: GridSettings<LectureMonth> }[] = [] as { id: string, grid: GridSettings<LectureMonth> }[]
  constructor(private remult: Remult) { }
  get $() { return getFields(this, this.remult) };
  terms = terms

  @DataControl<ShluchLecturesComponent>({
    valueChange: async (row, col) => await row?.refresh()
  })
  @Fields.string({ caption: 'חיפוש נושא' })
  search = ''

  async ngOnInit(): Promise<void> {
    await this.refresh()
    if (this.lectures.length === 0) {
      await this.addLecture()
    }
  }

  getGrid(l: Lecture): GridSettings<LectureMonth> {
    return this.lecturesGrids.find(lll => lll.id === l.id)!.grid
  }

  async refresh() {
    this.lectures = await this.remult.repo(Lecture).find({
      where: { shluch: { $id: this.remult.user.id } }
    })
    if (!this.lectures) {
      this.lectures = [] as Lecture[]
    }
    for (const l of this.lectures) {
      this.lecturesGrids.push({
        id: l.id, grid: new GridSettings<LectureMonth>(
          this.remult.repo(LectureMonth), {
          where: { lecture: l, shluch: { $id: this.remult.user.id } },
          allowCrud: false,
          showPagination: false,
          numOfColumnsInGrid: 10,
          columnSettings: (row) => [
            row.month,
            row.done,
            row.payed],
          gridButtons: [{
            icon: 'refresh',
            textInMenu: () => 'רענן',
            click: async () => await this.refreshRow(l)
          }],
          rowButtons: [
            {
              icon: 'edit',
              name: 'עדכון חודש',
              click: async (row) => await this.addLectureMonth(row.lecture)
            }
          ]
        })
      })
    }
  }

  async refreshRow(row: Lecture) {
    await row._.reload()
  }

  async addLecture() {
    let add = this.remult.repo(Lecture).create()
    add.shluch = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false })
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: 'הוספת נושא',
        ok: async () => { await add.save() },
        fields: () => [
          add.$.name,
          add.$.months
        ]
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      await this.refresh()
    }
  }

  async certificates() {
  }

  async addLectureMonth(l: Lecture) {
    let add = this.remult.repo(LectureMonth).create()
    add.lecture = l
    add.shluch = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false })
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        title: 'הוספת חודש לימוד',
        ok: async () => { await add.save() },
        fields: () => [
          add.$.month,
          add.$.done,
          add.$.payed
        ]
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      await this.refreshRow(l)
    }
  }

}
