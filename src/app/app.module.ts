import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AgGridModule} from "ag-grid-angular";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AddEditGridDialogComponent} from "./dialogs/add-edit-grid-dialog/add-edit-grid-dialog.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AngularFireModule} from '@angular/fire/compat';
import {environment} from '../environments/environment';
import {HttpClientModule} from "@angular/common/http";
import {MatSelectModule} from "@angular/material/select";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {GridComponent} from "./components/grid-component/grid.component";

@NgModule({
  declarations: [
    AppComponent,
    AddEditGridDialogComponent,
    GridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatInputModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule,
    MatSelectModule,
    FormsModule

  ],
  exports: [
    MatDialogModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
