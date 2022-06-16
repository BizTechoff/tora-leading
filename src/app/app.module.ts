import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { RemultModule } from '@remult/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogService } from './common/popup/dialog';
import { InputAreaComponent } from './common/popup/input-area/input-area.component';
import { YesNoQuestionComponent } from './common/popup/yes-no-question/yes-no-question.component';
import { AvrechimComponent } from './core/avrech/avrechim/avrechim.component';
import { ShluchDetailsComponent } from './core/shluch/shluch-details/shluch-details.component';
import { ShluchimComponent } from './core/shluch/shluchim/shluchim.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard, AvrechGuard, ManagerGuard, ManagerOrAdminGuard, ShluchGuard } from "./users/AuthGuard";
import { UsersComponent } from './users/users.component';
import { AvrechDetailsComponent } from './core/avrech/avrech-details/avrech-details.component';
import { ShluchLecturesComponent } from './core/shluch/shluch-lectures/shluch-lectures.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    HomeComponent,
    YesNoQuestionComponent,
    InputAreaComponent,
    ShluchimComponent,
    AvrechimComponent,
    ShluchDetailsComponent,
    AvrechDetailsComponent,
    ShluchLecturesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatExpansionModule,
    RemultModule
  ],
  providers: [DialogService, AdminGuard, ManagerGuard, ShluchGuard, AvrechGuard, ManagerOrAdminGuard],
  bootstrap: [AppComponent],
  entryComponents: [YesNoQuestionComponent, InputAreaComponent]
})
export class AppModule { }
