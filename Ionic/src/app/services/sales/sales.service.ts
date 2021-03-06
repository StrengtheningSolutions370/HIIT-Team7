
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/semi */
import { Injectable, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SaleItem } from 'src/app/models/sale-item';
import { AddSitemComponent } from 'src/app/pages/sale/sale-item/add-sitem/add-sitem.component';
import { DeleteSitemComponent } from 'src/app/pages/sale/sale-item/delete-sitem/delete-sitem.component';
import { UpdateSitemComponent } from 'src/app/pages/sale/sale-item/update-sitem/update-sitem.component';
import { ViewSitemComponent } from 'src/app/pages/sale/sale-item/view-sitem/view-sitem.component';
import { ConfirmSitemComponent } from 'src/app/pages/sale/sale-item/confirm-sitem/confirm-sitem.component';
import { RepoService } from '../repo.service';
import { Observable } from 'rxjs';
import { SaleCategory } from 'src/app/models/sale-category';
import { AddCategoryComponent } from 'src/app/pages/sale/sale-category/add-category/add-category.component';
import { DeleteCategoryComponent } from 'src/app/pages/sale/sale-category/delete-category/delete-category.component';
import { UpdateCategoryComponent } from 'src/app/pages/sale/sale-category/update-category/update-category.component';
import { ViewCategoryComponent } from 'src/app/pages/sale/sale-category/view-category/view-category.component';
import { ConfirmCategoryComponent } from 'src/app/pages/sale/sale-category/confirm-category/confirm-category.component';
import { AssociativeCategoryComponent } from 'src/app/pages/sale/sale-category/associative-category/associative-category.component';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  @Output() fetchSaleItemsEvent = new EventEmitter<SaleItem>();
  @Output() fetchSaleCategoriesEvent = new EventEmitter<SaleCategory>();

constructor(public repo: RepoService, private modalCtrl: ModalController) {
  //this should improve request time by caching the request when first loaded
  this.getAllSaleCategories().subscribe();
  this.getAllSaleItems().subscribe();
}

//READS:
  getAllSaleItems() : Observable<any> {
    return this.repo.getSaleItems();
  }

  getAllSaleCategories() : Observable<any> {
    return this.repo.getSaleCategory();
  }

  matchingSaleItem(name: string, description: string):Promise<any>{
    console.log('saleService: Repo -> Matching saleItem');
    return this.repo.getMatchSaleItem(name, description).toPromise();
   }

   matchingSaleCategory(name: string, description: string):Promise<any>{
    console.log('saleService: Repo -> Matching saleCategory');
    return this.repo.getMatchSaleCategory(name, description).toPromise();
   }


 //Methods
  //Add a saleitem to the saleitem list within the sales service.
  createSaleItem(saleItem: any){
    this.repo.createSaleItem(saleItem).subscribe(
      {
        next: () => {
          console.log('SALE ITEM CREATED');
          this.fetchSaleItemsEvent.emit(saleItem);
        }
      }
    );
   }

   createSaleCategory(saleCategory: any){
    this.repo.createSaleCategory(saleCategory).subscribe(
      {
        next: () => {
          console.log('SALE CATEGORY CREATED');
          this.fetchSaleCategoriesEvent.emit(saleCategory);
        }
      }
    );
   }


  //Receives a sale item to update in the service sale  list.
   async updateSaleItem(saleItem: any) {
     return this.repo.updateSaleItem(saleItem.saleItemID,saleItem).subscribe(
       {
        next: () => {
          console.log('SALE ITEM UPDATED');
          this.fetchSaleItemsEvent.emit(saleItem);
        },
        error: err => {
          console.log('SALE ITEM UPDATED FAILED');
        }
       }
     );
   }

   //Receives a sale category to update in the service sale  list.
   async updateSaleCategory(id: number,saleCategory: any) {
    return this.repo.updateSaleCategory(id,saleCategory).subscribe(
      {
       next: (res) => {
        console.log(res);
         console.log('SALE CATEGORY UPDATED');
         this.fetchSaleCategoriesEvent.emit(saleCategory);
       }
      }
    );
  }

  //Receives a sale item to delete in the service vat list.
   deleteSaleItem(id: number){
     console.log('HERE = ' + id);
    this.repo.deleteSaleItem(id).subscribe(
      {
        next: res => {
          console.log(res);
          console.log('SALE ITEM DELETED');
          this.fetchSaleItemsEvent.emit();
        },
        error: err => {
          console.log('??RROR HERE');
          console.log(err);
        }
      }
    );
   }

    //Receives a sale category to delete in the service vat list.
    deleteSaleCategory(id: number){
      this.repo.deleteSaleCategory(id).subscribe(
        {
          next: res => {
            console.log(res);
            console.log('SALE CATEGORY DELETED');
            this.fetchSaleCategoriesEvent.emit();
          },
          error: err => {
            console.log('??RROR HERE');
            console.log(err);
          }
        }
      );
     }



  //Modals:
  //CREATE Sale Item
  async addSaleItemInfoModal(saleItem?: SaleItem, image?: any) {
    const modal = await this.modalCtrl.create({
      component: AddSitemComponent,
      componentProps:{
        saleItem,
        image
      }
    });
    await modal.present();
  }
  //CREATE Sale Category
  async addCategoryInfoModal(saleCategory?: SaleCategory) {
    const modal = await this.modalCtrl.create({
      component: AddCategoryComponent,
      componentProps:{
        saleCategory
      }
    });
    await modal.present();
  }

  //UPDATE Sale item
  async updateSaleItemInfoModal(saleItem: SaleItem) {

    console.log("SalesService: UpdateSaleItemModalCall");
    console.log(saleItem);

    const modal = await this.modalCtrl.create({
      component: UpdateSitemComponent,
      componentProps:{
        saleItem
      }
    });
    await modal.present();
  }

  //UPDATE Sale category
  async updateCategoryInfoModal(saleCategory: SaleCategory) {
    console.log('SalesService: UpdateSaleItemModalCall');
    const modal = await this.modalCtrl.create({
      component: UpdateCategoryComponent,
      componentProps:{
        saleCategory
      }
    });
    await modal.present();
  }


  //DELETE Sale item
  async deleteSaleItemInfoModal(saleItem: SaleItem) {
    console.log('SalesService: DeleteSaleItemModalCall');
      const modal = await this.modalCtrl.create({
        component: DeleteSitemComponent,
          componentProps: {
            saleItem
        }
      });
      await modal.present();
    }

   //DELETE Sale Category
  async deleteCategoryInfoModal(saleCategory: any) {
    console.log("SalesService: DeleteSaleCategoryModalCall");
    if (saleCategory.saleItem!= null && saleCategory.saleItem.length > 0){
      console.log("SalesService: Found associative in delete");
      console.log(saleCategory);
      const modal = await this.modalCtrl.create({
        component: AssociativeCategoryComponent,
          componentProps: {
            saleCategory
        }
      });

      await modal.present();
    } else {
      const modal = await this.modalCtrl.create({
        component: DeleteCategoryComponent,
          componentProps: {
            saleCategory
        }
      });
      await modal.present();
    }
  }


  //VIEW Sale Item
  async viewSaleItemInfoModal(saleItem: SaleItem) {
    console.log("SalesService: ViewSaleItemModalCall");
    console.log(saleItem)

    const modal = await this.modalCtrl.create({
      component: ViewSitemComponent,
      componentProps: {
        saleItem
      }
    });
    await modal.present();
  }

  //VIEW Sale Category
  async viewCategoryInfoModal(saleCategory: SaleCategory) {
    console.log("SalesService: ViewSaleCategoryModalCall");
    // let tempSaleCategory = new SaleCategory();
    // tempSaleCategory = Object.assign(saleCategory);
    // console.log(tempSaleCategory);
    const modal = await this.modalCtrl.create({
      component: ViewCategoryComponent,
      componentProps: {
        saleCategory
      }
    });
    await modal.present();
  }


  //CONFIRM Sale item
  async confirmSaleItemModal(choice: number, saleItem: any, categoryName : string, image : any) {

    console.log('SaleItemService: ConfirmSaleItemModalCall');
    console.log(choice);
    if(choice === 1){
      console.log('Performing ADD');
      const modal = await this.modalCtrl.create({
        component: ConfirmSitemComponent,
        componentProps: {
          saleItem,
          choice,
          categoryName,
          image
        }
      });

      // //Update the current vat list with the vat list from the confirm modal.
      // modal.onDidDismiss().then(() => {

      //   this.repo.getSaleItems();

      // });

      await modal.present();

    } else if (choice === 2){

      console.log("Performing UPDATE");
      console.log(saleItem);


      const modal = await this.modalCtrl.create({
        component: ConfirmSitemComponent,
        componentProps: {
          saleItem,
          choice,
          categoryName,
          image
        }
      });

      // modal.onDidDismiss().then(() => {

      //   // this.repo.getSaleItems();
      //   // this.updateSaleItemInfoModal(saleItem);

      // });

      await modal.present();

    } else {

      console.log('BadOption: ' + choice);

    }
  }


  //CONFIRM Sale category

  //Display the confirm create/update modal
  //Receives the selected saleCategory from the sale category page

  async confirmSaleCategoryModal(choice: number, saleCategory: any) {
    console.log('SaleService: ConfirmSaleCategoryModalCall');
    console.log(choice);
    if(choice === 1){
      console.log('Performing ADD');
      const modal = await this.modalCtrl.create({
        component: ConfirmCategoryComponent,
        componentProps: {
          saleCategory,
          choice
        }
      });

      //Update the current vat list with the vat list from the confirm modal.
      // modal.onDidDismiss().then(() => {

      //   this.repo.getSaleCategory();

      // });

      await modal.present();

    } else if (choice === 2){

      console.log('Performing UPDATE');


      const modal = await this.modalCtrl.create({
        component: ConfirmCategoryComponent,
        componentProps: {
          saleCategory,
          choice
        }
      });

      // modal.onDidDismiss().then(() => {

      //   this.repo.getSaleCategory();

      // });

      await modal.present();

    } else {

      console.log('BadOption: ' + choice);

    }
  }
}
