import { Component, Input } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global/global.service';
import { SalesService } from 'src/app/services/sales/sales.service';

@Component({
  selector: 'app-delete-sitem',
  templateUrl: './delete-sitem.component.html',
  styleUrls: ['./delete-sitem.component.scss'],
})
export class DeleteSitemComponent implements ViewWillEnter {

  @Input() saleItem: any;
  @Input() categoryName: string;
  @Input() image:any;

  currentCategory! : string;

  constructor(private global: GlobalService, 
    public saleService: SalesService) { }
  
    ionViewWillEnter() {
      console.log('DeleteSaleItem - ViewWillEnter');
      console.log(this.saleItem);
      this.convertToName();
    }
  
    //Send through the id of the selected sale item to be deleted in the sale item service.
    async delete(id: number){
      this.saleService.deleteSaleItem(id);
      this.global.dismissModal();
      this.global.showToast("The Sale Item has been successfully deleted!");
    }

    public createImg = (fileName: string) => { 
      return `https://localhost:44383/Resources/Images/saleItemImages/${fileName}`; 
    }

    convertToName() {
      this.saleService.getAllSaleCategories().subscribe(
        {
          next: data => {
            data.forEach(element => {
              if (element.saleCategoryId == this.saleItem.saleCategoryId) {
                this.currentCategory = element.name;
              }
            });
          }
        }
      )
    }
  

}
