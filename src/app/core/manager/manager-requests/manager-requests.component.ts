import { Component, OnInit } from '@angular/core';
import { openDialog } from '@remult/angular';
import { DataControl, GridSettings } from '@remult/angular/interfaces';
import { ChartOptions, ChartType } from 'chart.js';
import { Color, Label, SingleDataSet } from 'ng2-charts';
import { Fields, getFields, Remult } from 'remult';
import { DialogService } from '../../../common/popup/dialog';
import { InputAreaComponent } from '../../../common/popup/input-area/input-area.component';
import { terms } from '../../../terms';
import { User } from '../../../users/user';
import { LectureMonth } from '../../lecture/lectureMonth';


export class filterBy {
  static branch = new filterBy()
  static status = new filterBy()
  static purpose = new filterBy()
  static period = new filterBy()
  static day = new filterBy()
}

@Component({
  selector: 'app-manager-requests',
  templateUrl: './manager-requests.component.html',
  styleUrls: ['./manager-requests.component.scss']
})
export class ManagerRequestsComponent implements OnInit {
  constructor(private dialog: DialogService, public remult: Remult) {
  }
  get $() { return getFields(this, this.remult) };
  terms = terms
  filterBy = filterBy


  /* PIE */


  colors = [
    '#91D7D7',//green
    '#FAC090',//orange
    '#FDE098',//yello
    '#84C5F1',//blue
    '#FD9FB3',//red
    'ffce56',//yellow2
    'cc65fe',//purple
    '36a2eb',//blue2
    'ff6384'//red2
    // 'gray'
  ];

  public pieChartColors: Color[] = [{ backgroundColor: this.colors }];
  public pieChartDataStatuses: SingleDataSet = [];
  public pieChartLabelsStatuses: Label[] = [];
  public pieChartPlugins = [];
  public pieChartLegend = true;
  public pieChartType: ChartType = 'pie';

  public pieChartOptionsByStatuses: ChartOptions = {
    responsive: true,
    // onClick: (event: MouseEvent, legendItem: any) => {
    //   // this.openActivitiesByStatuses()
    //   return false;
    // },//type PositionType = 'left' | 'right' | 'top' | 'bottom' | 'chartArea';
    title: { text: 'בקשות', display: true },
    // maintainAspectRatio: false,
    // layout: { padding: { left: +28 } },
    legend: {
      // align: 'start',
      // rtl: true,
      // textDirection: 'rtl',
      position: 'right',
      // onClick: (event: MouseEvent, legendItem: any) => {
      //   // this.currentStatFilter = this.pieChartStatObjects[legendItem.index];

      //   return false;
      // }
    },
  };

  public async chartClicked(by: filterBy, e: any) {

  }

  /* PIE */

  @DataControl<ManagerRequestsComponent>({
    clickIcon: 'serach',
    hideDataOnInput: true,
    click: () => { console.log('click') },
    valueChange: async (row, col) => {
      console.log('valueChange')
      await row?.refresh()
    }
  })
  @Fields.string<ManagerRequestsComponent>({ caption: 'חיפוש משתמש' })
  search = ''

  registers = new GridSettings(this.remult.repo(User), {
    where: { approved: false },
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
    confirmDelete: async (u) => {
      return await this.dialog.confirmDelete(u.name)
    },
  });

  paying = new GridSettings(this.remult.repo(LectureMonth), {
    where: { done: true, payed: false },
    allowCrud: false,
    numOfColumnsInGrid: 10,

    // orderBy: { name: "asc" },
    rowsInPage: 25,

    columnSettings: row => [
      { field: row.shluch, getValue: (row, col) => row?.$.shluch?.value?.name },
      { field: row.lecture, getValue: (row, col) => row?.$.lecture?.value?.name },
      row.month,
      row.done,
      row.payed
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
    confirmDelete: async (u) => {
      return await this.dialog.confirmDelete(u.month.caption)
    },
  });

  async ngOnInit() {
    await this.refresh()
  }

  async refresh() {
    this.pieChartLabelsStatuses = [] as Label[]
    this.pieChartDataStatuses = [] as SingleDataSet
    let months: { caption: string, count: number }[] = []
    let lectures = await this.remult.repo(LectureMonth).find()
    for (const r of lectures) {
      let label = r.month?.caption;//.replace('ממתין', 'לא');
      let found = months.find(s => s.caption === label)
      if (!found) {
        found = { caption: label, count: 0 }
        months.push(found)
      }
      ++found.count
    }
    // if (a.status === ActivityStatus.problem) {
    //   label = label;
    // }
    // label += ` (${6})`;// ` (${r.count})`;
    this.pieChartLabelsStatuses.push(months.map(s => s.caption));//label.replace('הסתיים ב', ''));
    this.pieChartDataStatuses.push(months.map(s => s.count));//r.count);

    console.log('months.map(s => s.caption)', JSON.stringify(months))
    console.log('this.pieChartLabelsStatuses', JSON.stringify(this.pieChartLabelsStatuses))
    console.log('this.pieChartDataStatuses', JSON.stringify(this.pieChartDataStatuses))

    await this.registers.reloadData()
    await this.paying.reloadData()
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
          [
            { field: u.$.name, caption: 'שם פרטי', width: '100%' },
            { field: u.$.fname, caption: 'שם משפחה', width: '100%' }
          ],
          u.$.marriageDate,
          u.$.missionLocation,
          u.$.missionDate,
          u.$.email,
          [
            { field: u.$.mobile, width: '100%' },
            { field: u.$.phone, width: '100%' }
          ],
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
