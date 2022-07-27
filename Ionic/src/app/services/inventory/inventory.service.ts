/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/semi */
import { Injectable, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WriteOffReason } from 'src/app/models/write-off-reason'; 
import { AddWriteOffReasonComponent } from 'src/app/pages/inventory/write-off-reason/add-write-off-reason/add-write-off-reason.component'; 
import { DeleteWriteOffReasonComponent } from 'src/app/pages/inventory/write-off-reason/delete-write-off-reason/delete-write-off-reason.component'; 
import { UpdateWriteOffReasonComponent } from 'src/app/pages/inventory/write-off-reason/update-write-off-reason/update-write-off-reason.component'; 
import { ViewWriteOffReasonComponent } from 'src/app/pages/inventory/write-off-reason/view-write-off-reason/view-write-off-reason.component'; 
import { ConfirmWriteOffReasonComponent } from 'src/app/pages/inventory/write-off-reason/confirm-write-off-reason/confirm-write-off-reason.component'; 
import { AssociativeWriteOffReasonComponent } from 'src/app/pages/inventory/write-off-reason/associative-write-off-reason/associative-write-off-reason.component'; 
import { RepoService } from '../repo.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  @Output() fetchWriteOffReasonsEvent = new EventEmitter<WriteOffReason>();

  constructor(public repo: RepoService, private modalCtrl: ModalController ) { 
    //Receive the write-off reasons from the repo (API).
    this.getAllWriteOffReasons();
  }

  //READS:
  getAllWriteOffReasons(): Observable<any> {
    return this.repo.getWriteOffReason();
  }

  matchingWriteOffReason(input: string): Promise<any>{
    console.log('writeOffReasonService: Repo -> Matching WRITE-OFF REASON');
    return this.repo.getMatchWriteOffReason(input).toPromise();
  }

  //CREATE:
  createWriteOffReason(writeOffReason: any): any {
    this.repo.createWriteOffReason(writeOffReason).subscribe(
      {
        next: (data) => {
          console.log("CREATE WRITE-OFF REASON DATA:");
          console.log(data);
          this.fetchWriteOffReasonsEvent.emit(writeOffReason);
          return data;
        }, 
        error: (err) => {
          console.log("ERROR - CREATE WRITE-OFF REASON DATA:");
          console.log(err);
          return err;
        }
      }
    )
  }

  //UPDATE:
  updateWriteOffReason(id: number,writeOffReason: any):any {
    return this.repo.updateWriteOffReason(id,writeOffReason).subscribe(
      {
       next: (data) => {
         console.log('UPDATED WRITE-OFF REASON DATA:');
         console.log(data);
         this.fetchWriteOffReasonsEvent.emit(writeOffReason);
       },
       error: (err) => {
         console.log("ERROR - UPDATE WRITE-OFF REASON DATA:");
         console.log(err);
         return err;
       }
      }
    )
  }

  //DELETE:
  deleteWriteOffReason(id: number){
    this.repo.deleteWriteOffReason(id).subscribe(result => {
      console.log('WRITE-OFF REASON DELETED');
      this.fetchWriteOffReasonsEvent.emit();
    });
  }

  //MODALS:
  //CREATE
  async addWriteOffReasonInfoModal(writeOffReason?: WriteOffReason) {
    const modal = await this.modalCtrl.create({
      component: AddWriteOffReasonComponent,
      componentProps:{
        writeOffReason
      }
    });
    await modal.present();
  }

  //UPDATE
  async updateWriteOffReasonInfoModal(writeOffReason?: WriteOffReason) {
    console.log("WriteOffReasonService: UpdateWriteOffReasonModalCall");
    const modal = await this.modalCtrl.create({
      component: UpdateWriteOffReasonComponent,
      componentProps:{
        writeOffReason
      }
    });
    await modal.present();
  }

  //DELETE
  async deleteWriteOffReasonInfoModal(writeOffReason: WriteOffReason) {
    console.log("WriteOffReasonService: DeleteWriteOffReasonModalCall");
    if (writeOffReason.writeOffLines!= null && writeOffReason.writeOffLines.length > 0){
      const modal = await this.modalCtrl.create({
        component: AssociativeWriteOffReasonComponent,
          componentProps: {
            writeOffReason
        }
      });
      await modal.present();
    } else {
      const modal = await this.modalCtrl.create({
        component: DeleteWriteOffReasonComponent,
          componentProps: {
            writeOffReason
        }
      });
      await modal.present();
    }
  }

  //ASSOCIATIVE
  async associativeWriteOffReasonModal(writeOffReason: WriteOffReason) {
    console.log("WriteOffReasonService: AssociativeWriteOffReasonModalCall");
    const modal = await this.modalCtrl.create({
      component: AssociativeWriteOffReasonComponent,
      componentProps: {
        writeOffReason
      }
    });
    await modal.present();
  }

  //VIEW
  async viewWriteOffReasonInfoModal(writeOffReason: WriteOffReason) {
    console.log("WriteOffReasonService: ViewWriteOffReasonInfoModalCall");
    const modal = await this.modalCtrl.create({
      component: ViewWriteOffReasonComponent,
      componentProps: {
        writeOffReason
      }
    });
    await modal.present();
  }

  //CONFIRM
  async confirmWriteOffReasonModal(choice: number, writeOffReason: any) {
    console.log('WriteOffReasonService: ConfirmWriteOffReasonModalCall');
    console.log(choice);
    if(choice === 1){
      console.log("Performing ADD");
      const modal = await this.modalCtrl.create({
        component: ConfirmWriteOffReasonComponent,
        componentProps: {
          writeOffReason,
          choice
        }
      });
      await modal.present();

    } else if (choice === 2){

      console.log("Performing UPDATE");
      const modal = await this.modalCtrl.create({
        component: ConfirmWriteOffReasonComponent,
        componentProps: {
          writeOffReason,
          choice
        }
      });
      await modal.present();
    } 
    else 
    {
      console.log("BadOption: " + choice)
    }
  }
}
