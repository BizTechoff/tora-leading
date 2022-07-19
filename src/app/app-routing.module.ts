import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { RemultModule } from '@remult/angular';
import { AuthService } from './auth.service';
import { ShowDialogOnErrorErrorHandler } from './common/popup/dialog';
import { AvrechDetailsComponent } from './core/avrech/avrech-details/avrech-details.component';
import { AvrechimComponent } from './core/avrech/avrechim/avrechim.component';
import { ManagerRequestsComponent } from './core/manager/manager-requests/manager-requests.component';
import { ShluchDetailsComponent } from './core/shluch/shluch-details/shluch-details.component';
import { ShluchLecturesComponent } from './core/shluch/shluch-lectures/shluch-lectures.component';
import { ShluchimComponent } from './core/shluch/shluchim/shluchim.component';
import { HomeComponent } from './home/home.component';
import { terms } from './terms';
import { AdminGuard, AvrechGuard, ManagerOrAdminGuard, NotAuthenticatedOrNoRolesGuard, ShluchGuard } from "./users/AuthGuard";
import { UsersComponent } from './users/users.component';

const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedOrNoRolesGuard] },
  { path: terms.currentState, component: ManagerRequestsComponent, canActivate: [ManagerOrAdminGuard] },
  { path: terms.shluchim, component: ShluchimComponent, canActivate: [ManagerOrAdminGuard] },
  { path: terms.avrechim, component: AvrechimComponent, canActivate: [ManagerOrAdminGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: terms.myLectures, component: ShluchLecturesComponent, canActivate: [ShluchGuard] },
  { path: terms.myDetails, component: ShluchDetailsComponent, canActivate: [ShluchGuard] },
  { path: terms.myDetails, component: AvrechDetailsComponent, canActivate: [AvrechGuard] },
  { path: '**', component: HomeComponent, pathMatch: 'full', data: { name: defaultRoute } }//, redirectTo: '/' + defaultRoute
];

@NgModule({
  imports: [RouterModule.forRoot(routes /*, { enableTracing: true }*/),
    RemultModule,
  JwtModule.forRoot({
    config: { tokenGetter: () => AuthService.fromStorage() }
  })],
  providers: [AdminGuard, { provide: ErrorHandler, useClass: ShowDialogOnErrorErrorHandler }],
  exports: [RouterModule]
})
export class AppRoutingModule { }
