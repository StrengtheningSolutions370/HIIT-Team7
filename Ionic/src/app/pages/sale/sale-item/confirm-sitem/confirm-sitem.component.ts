import { Component, Input} from '@angular/core';
import { SaleItem } from 'src/app/models/sale-item';
import { GlobalService } from 'src/app/services/global/global.service';
import { SalesService } from 'src/app/services/sales/sales.service';

@Component({
  selector: 'app-confirm-sitem',
  templateUrl: './confirm-sitem.component.html',
  styleUrls: ['./confirm-sitem.component.scss'],
})
export class ConfirmSitemComponent {
  @Input() choice: number;
  @Input() saleItem: any;
  @Input() categoryName: string;
  @Input() image : any;

  constructor(public global: GlobalService, public saleService: SalesService) {
  }

  //1 = confirm ADD
  //2 = confirm UPDATE
  async confirmChanges(saleItem: SaleItem){
    console.log(this.choice);
            if (this.choice === 1){
              this.saleService.matchingSaleItem(saleItem.name,saleItem.description).then(data => {
                if (data != 0){
                  this.global.showAlert("The sale item information entered already exists on the system","Duplicate Entry");
                  return;
                } else {
                  console.log('Add Sale Item from confirm:');
                  //CallRepoToCreate
                  this.saleService.createSaleItem(saleItem);
                  this.global.dismissModal();
                  this.global.showToast("The sale item has been successfully added!");
                }
              });

          } else if (this.choice === 2){
            this.saleService.matchingSaleItem(saleItem.name,saleItem.description).then(data => {
              if (data.result.length > 1){
                this.global.showAlert("The sale item information entered already exists on the system","Duplicate Entry");
                return;
              } else {
                console.log('Update Sale Item from confirm:');
            //CallRepoToUpdate
            console.log(saleItem);
            this.saleService.updateSaleItem(saleItem);
            this.global.dismissModal();
            this.global.showToast('The sale item has been successfully updated!'); 
              }
            });
   
          }

  }

  async returnFrom(){
    //1 = return to ADD
    //2 = return to UPDATE
    if (this.choice === 1){
      this.global.dismissModal();
      this.saleService.addSaleItemInfoModal(this.saleItem);
    } else if (this.choice === 2){
      this.global.dismissModal();
      this.saleService.updateSaleItemInfoModal(this.saleItem);
    }
  }
}
