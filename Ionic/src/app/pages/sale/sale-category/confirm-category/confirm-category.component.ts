import { Component, Input} from '@angular/core';
import { SaleCategory } from 'src/app/models/sale-category';
import { GlobalService } from 'src/app/services/global/global.service';
import { SalesService } from 'src/app/services/sales/sales.service';

@Component({
  selector: 'app-confirm-category',
  templateUrl: './confirm-category.component.html',
  styleUrls: ['./confirm-category.component.scss'],
})
export class ConfirmCategoryComponent{
  @Input() choice: number;
  @Input() saleCategory: SaleCategory;

  constructor(public global: GlobalService, public saleService: SalesService) {
  }

  async checkMatch(name: string, address: string): Promise<boolean>{
    return this.saleService.matchingSaleCategory(name,address).then(result => {
      console.log('Check match result:');
      console.log(result);
       if (result != 0){
         this.global.showAlert('The sale category information entered already exists on the system','Duplicate Entry');
         return true;
       } else {
         return false;
       }
     });
   }

  //1 = confirm ADD
  //2 = confirm UPDATE
  async confirmChanges(saleCategory: SaleCategory){
    //search duplicates
    await this.checkMatch(saleCategory.name,saleCategory.description).then(result =>{
      console.log(result);
      if (result == true){
         return;
       } else {
          if (this.choice === 1){
            console.log('Add Sale Category from confirm:');
            //CallRepoToCreate
            this.saleService.createSaleCategory(saleCategory);
            this.global.dismissModal();
            this.global.showToast('The sale category has been successfully added!');
        } else if (this.choice === 2){
            console.log('Update Sale Category from confirm:');
            //CallRepoToUpdate
            this.saleService.updateSaleCategory(saleCategory.saleCategoryID,saleCategory);
            this.global.dismissModal();
            this.global.showToast('The sale category has been successfully updated!');
          }
        }
      }
    );
  }

  async returnFrom(){
    //1 = return to ADD
    //2 = return to UPDATE
    if (this.choice === 1){
      console.log(this.saleCategory);
      this.global.dismissModal();
      this.saleService.addCategoryInfoModal(this.saleCategory);
    } else if (this.choice === 2){
      console.log(this.saleCategory);
      this.global.dismissModal();
      this.saleService.updateCategoryInfoModal(this.saleCategory);
    }
  }

}
