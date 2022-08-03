import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { openDialog } from '@remult/angular';
import { Remult, ValueListItem } from 'remult';
import { InputAreaComponent } from '../../../common/popup/input-area/input-area.component';
import { terms } from '../../../terms';
import { User } from '../../../users/user';
import { CourseType } from '../../course/courseType';
import { Lecture } from '../lecture';
import { Months } from '../months';

@Component({
  selector: 'app-lecture-details',
  templateUrl: './lecture-details.component.html',
  styleUrls: ['./lecture-details.component.scss']
})
export class LectureDetailsComponent implements OnInit {

  args: { changed?: boolean, title: string } = {
    title: '',
    changed: false
  }
  lectures!: Lecture[]
  constructor(private remult: Remult, private dialogRef: MatDialogRef<any>) { }
  terms = terms

  async ngOnInit(): Promise<void> {
    if (!this.remult.user.isShluch) throw 'You are NOT SHLUCH'
    if (!this.args) {
      this.args = { changed: false, title: '' }
    }
    this.args.changed = false
    this.refresh()
  }

  async refresh() {
    this.lectures = await this.remult.repo(Lecture).find({
      where: { shluch: { $id: this.remult.user.id } }
    })
  }

  removing = false
  async remove(lid: string) {
    if (!this.removing) {
      this.removing = true
      if (lid?.length) {
        await this.remult.repo(Lecture).delete(lid)
        await this.refresh()
      }
      this.removing = false
    }
  }

  async addLecturesGrades() {

  }

  async addLecture() {
    let add = this.remult.repo(Lecture).create()
    add.shluch = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false })
    let changed = await openDialog(InputAreaComponent,
      dlg => dlg.args = {
        helpText: 'מוצגים לך רק נושאים שעדיין לא רשמת',
        title: 'הוספת נושא נוסף שנבחנת עליו',
        ok: async () => { await add.save() },
        fields: () => [
          {
            field: add.$.course,
            caption: 'נושאים שנותרו לך',
            valueList: async () => {
              let f = [] as ValueListItem[]
              let exists = await this.remult.repo(Lecture).find({
                where: { shluch: { $id: this.remult.user.id } }
              })
              let exsitsCourses = exists.map(l => l.course)
              let all = CourseType.getOptions(exsitsCourses)
              return all
            }
          },
          add.$.organizer,
          [
            add.$.year,
            {
              field: add.$.month,
              click: (row, col) => { },
              valueList: async () => {
                let f = [] as ValueListItem[]
                let exists = await this.remult.repo(Lecture).find({
                  where: {
                    shluch: { $id: this.remult.user.id },
                    year: add.$.year.value
                  }
                })
                let exsitsMonths = exists.map(l => l.month)
                let all = Months.getOptions(exsitsMonths)
                console.log(add.$.year.value, all)
                return all
              }
            },
          ]
        ]
      },
      dlg => dlg ? dlg.ok : false)
    if (changed) {
      await this.refresh()
    }
  }

  // disableClose = () => this.lecture?._.wasChanged()

  async save() {
    // if (this.lectures._.wasChanged()) {
    //   this.args.changed = true
    //   // await this.lectures.save()
    // }
    // this.close()
  }

  close() {
    this.dialogRef.close()
  }

}
