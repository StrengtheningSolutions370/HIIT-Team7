import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AddVenueComponent } from './pages/venue/add-venue/add-venue.component';
import { UpdateVenueComponent } from './pages/venue/update-venue/update-venue.component';
import { ViewVenueInfoComponent } from './pages/venue/view-venue-info/view-venue-info.component';
import { DeleteVenueComponent } from './pages/venue/delete-venue/delete-venue.component';
import { ConfirmVenueComponent } from './pages/venue/confirm-venue/confirm-venue.component';
import { AssociativeVenueComponent } from './pages/venue/associative-venue/associative-venue.component';

import { AddVatComponent } from './pages/sale/vat/add-vat/add-vat.component';
import { UpdateVatComponent } from './pages/sale/vat/update-vat/update-vat.component';
import { DeleteVatComponent } from './pages/sale/vat/delete-vat/delete-vat.component';
import { ViewVatComponent } from './pages/sale/vat/view-vat/view-vat.component';

import { AddRoleComponent } from './pages/user/user-roles/add-role/add-role.component';
import { UpdateRoleComponent } from './pages/user/user-roles/update-role/update-role.component';
import { DeleteRoleComponent } from './pages/user/user-roles/delete-role/delete-role.component';
import { ViewRoleComponent } from './pages/user/user-roles/view-role/view-role.component';

import { AddTitleComponent } from './pages/user/titles/add-title/add-title.component';
import { UpdateTitleComponent } from './pages/user/titles/update-title/update-title.component';
import { DeleteTitleComponent } from './pages/user/titles/delete-title/delete-title.component';
import { ViewTitlesComponent } from './pages/user/titles/view-titles/view-titles.component';

@NgModule({
  declarations: [AppComponent,
  AddVenueComponent, UpdateVenueComponent, ViewVenueInfoComponent, DeleteVenueComponent, ConfirmVenueComponent,AssociativeVenueComponent,
  AddVatComponent, UpdateVatComponent, DeleteVatComponent, ViewVatComponent,
  AddRoleComponent, UpdateRoleComponent, DeleteRoleComponent, ViewRoleComponent,
  AddTitleComponent, UpdateTitleComponent, DeleteTitleComponent, ViewTitlesComponent ],

  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
