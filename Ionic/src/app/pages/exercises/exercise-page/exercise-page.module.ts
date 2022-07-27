import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisePagePageRoutingModule } from './exercise-page-routing.module';

import { ExercisePagePage } from './exercise-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisePagePageRoutingModule
  ],
  declarations: [ExercisePagePage]
})
export class ExercisePagePageModule {}
