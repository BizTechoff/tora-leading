import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NotAuthenticatedGuard, RemultModule } from '@remult/angular';
import { AuthService } from './auth.service';
import { ShowDialogOnErrorErrorHandler } from './common/popup/dialog';
import { AvrechDetailsComponent } from './core/avrech/avrech-details/avrech-details.component';
import { AvrechimComponent } from './core/avrech/avrechim/avrechim.component';
import { ShluchDetailsComponent } from './core/shluch/shluch-details/shluch-details.component';
import { ShluchLecturesComponent } from './core/shluch/shluch-lectures/shluch-lectures.component';
import { ShluchimComponent } from './core/shluch/shluchim/shluchim.component';
import { HomeComponent } from './home/home.component';
import { terms } from './terms';
import { AdminGuard, AvrechGuard, ManagerOrAdminGuard, ShluchGuard } from "./users/AuthGuard";
import { UsersComponent } from './users/users.component';

const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard] },
  { path: terms.currentState, component: UsersComponent, canActivate: [ManagerOrAdminGuard] },
  { path: terms.shluchim, component: ShluchimComponent, canActivate: [ManagerOrAdminGuard] },
  { path: terms.avrechim, component: AvrechimComponent, canActivate: [ManagerOrAdminGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: terms.myLectures, component: ShluchLecturesComponent, canActivate: [ShluchGuard] },
  { path: terms.myDetails, component: ShluchDetailsComponent, canActivate: [ShluchGuard] },
  { path: terms.myDetails, component: AvrechDetailsComponent, canActivate: [AvrechGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' },
  // { path: '/', redirectTo: '/' + defaultRoute, pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    RemultModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
