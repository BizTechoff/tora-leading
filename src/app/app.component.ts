import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { openDialog, RouteHelperService } from '@remult/angular';
import { Remult } from 'remult';
import { AuthService } from './auth.service';
import { DialogService } from './common/popup/dialog';
import { InputAreaComponent } from './common/popup/input-area/input-area.component';
import { GlobalParam } from './globals';
import { terms } from './terms';
import { SignInController } from './users/SignInController';
import { UpdatePasswordController } from './users/UpdatePasswordController';
import { User } from './users/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  alloedRegister = true
  allowToStart = false

  constructor(
    public router: Router,
    public activeRoute: ActivatedRoute,
    private routeHelper: RouteHelperService,
    public dialogService: DialogService,
    public remult: Remult,
    public auth: AuthService) {
  }
  terms = terms;

  async ngOnInit(): Promise<void> {
    // let u = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false });
    this.allowToStart = GlobalParam.allowToStart// u?.allowToStart ?? false
    console.log(1)
    if (this.allowToStart) {
      console.log(2)
      await this.navigateByRoleIfFirstRouting()
    }
  }

  async signIn(name = '') {
    const signIn = new SignInController(this.remult);
    signIn.user = name
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.signIn,
      object: signIn,
      ok: async () => {
        this.auth.setAuthToken(await signIn.signIn(), signIn.rememberOnThisDevice);
        await this.navigateByRoleIfFirstRouting()
      }
    });
  }

  async signUp() {
    let title = 'הרשמה לתוכנית'
    let u = this.remult.repo(User).create()
    u.shluch = true
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

    this.dialogService.info('נרשמת בהצלחה. מסרון עם סיסמת כניסה נשלח לסלולרי שלך')
    this.signIn(u.name)

    // const signUp = new SignUpController(this.remult);
    // openDialog(InputAreaComponent, i => i.args = {
    //   title: terms.signUp,
    //   object: signUp,
    //   ok: async () => {
    //     let uid = await signUp.signUp()
    //     // await sendSms(Sms.ThanksForRegistering, uid)
    //     this.dialogService.info('נרשמת בהצלחה. מסרון עם סיסמת כניסה נשלח לסלולרי שלך')
    //     this.signIn(signUp.user)
    //   }
    // });
  }

  registeredOk() {
    return this.allowToStart
    // return this.remult.authenticated() && this.remult.user.roles.length > 0
  }

  async navigateByRoleIfFirstRouting() {
    console.log('this.router.url', this.router.url)
    let isFirstRouting =
      [
        '/',
        '',
        terms.home,
        encodeURI(terms.home),
        '/' + terms.home,
        '/' + encodeURI(terms.home)
      ].includes(this.router.url)

    console.log('isFirstRouting', isFirstRouting)
    if (isFirstRouting) {

      if (this.remult.user.isAdmin) {
        console.log(1)
        this.router.navigateByUrl(encodeURI(terms.userAccounts))
      }
      else if (this.remult.user.isManager) {
        console.log(2)
        this.router.navigateByUrl(encodeURI(terms.shluchim))
      }
      else if (this.remult.user.isShluch) {
        console.log(3)
        this.router.navigateByUrl(encodeURI(terms.myLectures))
      }
      else if (this.remult.user.isAvrech) {
        console.log(4)
        this.router.navigateByUrl(encodeURI(terms.myDetails))
      }
      else {
        console.log(5)
        this.router.navigateByUrl(encodeURI(terms.welcome))
        this.router.navigateByUrl(encodeURI(terms.home))
        this.router.navigateByUrl('/ברוכים%20הבאים')
        this.router.navigateByUrl('ברוכים הבאים')
      }
    }
  }

  signOut() {
    this.auth.setAuthToken(null);
    this.router.navigate(['/']);
  }

  async updateInfo() {
    let u = await this.remult.repo(User).findId(this.remult.user.id, { useCache: false });
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.updateInfo,
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
        await u._.save();
      }
    });
  }

  async changePassword() {
    const updatePassword = new UpdatePasswordController(this.remult);
    openDialog(InputAreaComponent, i => i.args = {
      title: terms.signIn,
      object: updatePassword,
      ok: async () => {
        await updatePassword.updatePassword();
      }
    });
  }

  routeName(route: Route) {
    let name = route.path;
    if (route.data && route.data['name'])
      name = route.data['name'];
    return name;
  }

  currentTitle() {
    if (this.activeRoute!.snapshot && this.activeRoute!.firstChild)
      if (this.activeRoute.snapshot.firstChild!.data!['name']) {
        return this.activeRoute.snapshot.firstChild!.data['name'];
      }
      else {
        if (this.activeRoute.firstChild.routeConfig)
          return this.activeRoute.firstChild.routeConfig.path;
      }
    return 'tora-leading';
  }

  shouldDisplayRoute(route: Route) {
    if (!(route.path && route.path.indexOf(':') < 0 && route.path.indexOf('**') < 0))
      return false;
    return this.routeHelper.canNavigateToRoute(route);
  }
  //@ts-ignore ignoring this to match angular 7 and 8
  @ViewChild('sidenav') sidenav: MatSidenav;
  routeClicked() {
    if (this.dialogService.isScreenSmall())
      this.sidenav.close();
  }

  openSite(url: string) {
    window.open(url, '_blank')
  }

  showRemultUser(e: MouseEvent) {
    try {
      if (e.ctrlKey) { alert(JSON.stringify(this.remult.user)) }
    }
    catch (err) { console.log(err) }
  }

}
