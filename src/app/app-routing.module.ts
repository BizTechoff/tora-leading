import { ErrorHandler, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NotAuthenticatedGuard, RemultModule } from '@remult/angular';
import { AuthService } from './auth.service';
import { ShowDialogOnErrorErrorHandler } from './common/popup/dialog';
import { AvrechimComponent } from './core/avrech/avrechim/avrechim.component';
import { ShluchDetailsComponent } from './core/shluch/shluch-details/shluch-details.component';
import { ShluchimComponent } from './core/shluch/shluchim/shluchim.component';
import { HomeComponent } from './home/home.component';
import { terms } from './terms';
import { AdminGuard, ShluchGuard } from "./users/AuthGuard";
import { UsersComponent } from './users/users.component';



const defaultRoute = terms.home;
const routes: Routes = [
  { path: defaultRoute, component: HomeComponent, canActivate: [NotAuthenticatedGuard] },
  { path: terms.currentState, component: UsersComponent, canActivate: [AdminGuard] },
  { path: terms.shluchim, component: ShluchimComponent, canActivate: [AdminGuard] },
  { path: terms.avrechim, component: AvrechimComponent, canActivate: [AdminGuard] },
  { path: terms.userAccounts, component: UsersComponent, canActivate: [AdminGuard] },
  { path: terms.myDetails, component: ShluchDetailsComponent, canActivate: [ShluchGuard] },
  { path: '**', redirectTo: '/' + defaultRoute, pathMatch: 'full' }

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
