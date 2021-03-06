import { Component, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewWillEnter } from '@ionic/angular';
import { SalesService } from 'src/app/services/sales/sales.service';
import { SaleCategory } from 'src/app/models/sale-category';
import { RepoService } from 'src/app/services/repo.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GlobalService } from 'src/app/services/global/global.service';



@Component({
  selector: 'app-update-sitem',
  templateUrl: './update-sitem.component.html',
  styleUrls: ['./update-sitem.component.scss'],
})
export class UpdateSitemComponent implements ViewWillEnter{

@Input() saleItem: any;
categoryDropDown! : SaleCategory[];
itemImage! : File;
itemImageBase64String! : any;
quotable! : boolean;

uSaleItemForm: FormGroup = new FormGroup({
  itemName: new FormControl('', [Validators.required]),
  itemDescription: new FormControl('', [Validators.required]),
  itemQuantity: new FormControl('', [Validators.required, Validators.min(1)]),
  itemPhoto: new FormControl(''),
  itemPrice: new FormControl('', [Validators.required, Validators.min(1)]),
  itemSCategory: new FormControl(''),
  itemQuotable: new FormControl('')
});

addImage(event : any) {
 this.itemImage = event.target.files[0];
console.log(this.itemImage);
 const re = /^image*/;

 if (this.itemImage.type.match(re)) {
  this.getBase64(this.itemImage);
 }
}

getBase64(file : File) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // console.log(reader.result);
    this.itemImageBase64String = reader.result;
  };
  reader.onerror = (error) => {
    this.itemImageBase64String = null;
  };
}

checkBoxToggle(check : any) {
  console.log("CheckBoxToggle: Inside Update Sale");
  console.log(check.target.checked);
  this.quotable = check.target.checked;
  if (this.quotable) {
    //is quotable
    this.uSaleItemForm.controls.itemPrice.disable();
    this.uSaleItemForm.controls.itemQuantity.disable();
    return;
  }
  console.log('here')
  this.uSaleItemForm.controls.itemPrice.enable();
  this.uSaleItemForm.controls.itemQuantity.enable();
}

constructor(public global: GlobalService, public formBuilder: FormBuilder,
 public saleService: SalesService, private repo : RepoService) {
}

 //Used for validation within the form, if there are errors in the control, this method will return the errors.
 get errorControl() {
   return this.uSaleItemForm.controls;
 }

 ionViewWillEnter(){

  //populating the dropdown for saleCategory:
  this.saleService.getAllSaleCategories().subscribe(
    {
      next: data => {
        this.categoryDropDown = data.result;
        console.log(data);
      }
    }
  )

  console.log("UpdateSaleItem-ViewWillEnter");    

    if (this.saleItem != null){
      this.quotable = this.saleItem.quotable;
      if (!this.quotable) {
        console.log("NOT quotable - reset price?");
        console.log(this.saleItem.price);
        console.log(this.saleItem.quantity);
        this.uSaleItemForm.controls['itemPrice'].setValue(this.saleItem.price);
        this.uSaleItemForm.controls['itemQuantity'].setValue(this.saleItem.quantity);
      }
      this.uSaleItemForm.controls['itemName'].setValue(this.saleItem.name);
      this.uSaleItemForm.controls['itemDescription'].setValue(this.saleItem.description);
      this.uSaleItemForm.controls['itemPhoto'].setValue(this.itemImageBase64String);
      this.uSaleItemForm.controls['itemQuotable'].setValue(this.saleItem.quotable);
      this.uSaleItemForm.controls['itemSCategory'].setValue(this.saleItem.SaleCategoryID);
    } else {
      this.global.showAlert("No venue selected for update","Update Venue Error");
      this.global.dismissModal();
    }

    //this.checkBoxToggle(this.saleItem.quotable);



      // this.uSaleItemForm.reset({
      //   itemPrice : ,
      //    : this.saleItem.quantity
      // })}

    // this.uSaleItemForm.reset({
    //   itemName : [this.saleItem.name],
    //   itemDescription : [this.saleItem.description],
    //   itemPhoto : this.itemImageBase64String,
    //   itemQuotable : this.saleItem.quotable,
    //   itemSCategory : [this.saleItem.SaleCategoryID]
    // })
  }

   submitForm() {

     if (this.uSaleItemForm.controls['itemSCategory'].value[0] == null) {
      this.global.showAlert("No Sale Category provided","Error updating sale item");
      return;
    }

    let priceTemp = Number(this.uSaleItemForm.controls['itemPrice'].value);
    let qtyTemp = this.uSaleItemForm.controls['itemQuantity'].value;

    if (this.quotable){
      priceTemp = 0;
      qtyTemp = 0;
    }

    
     var fName = this.saleItem.photo;
     if (this.itemImage != null) {
      var date = new Date();
      var epoch = date.getTime();
      fName = epoch + '_' + this.itemImage.name;
     }

     //form is valid for submission
    var obj = {
      name: this.uSaleItemForm.controls['itemName'].value,
      saleItemID: this.saleItem.saleItemID,
      photo: fName,
      description: this.uSaleItemForm.controls['itemDescription'].value,
      price: priceTemp,
      quotable: this.quotable,
      quantity: qtyTemp,
      saleCategoryID: Number(this.uSaleItemForm.controls['itemSCategory'].value.split(',')[0]),
      inventoryItem:null
    }

    console.log('ob');
    console.log(obj);

    // remove the old image
      if (this.itemImage != null) {
        //wait for image to upload:
        const formData = new FormData();
        console.log(this.itemImage);
        formData.append('file', this.itemImage, fName);

        this.repo.deleteSaleItemImage(this.saleItem.photo).subscribe({
          next: data => {

            // console.log(data);
            // upload the new image
            this.repo.uploadSaleItemImage(formData).subscribe({
              next: data => {
  
                //update the obj in db
                // this.repo.updateSaleItem()
                this.global.dismissModal();
                this.saleService.confirmSaleItemModal(2, obj, this.uSaleItemForm.value['itemSCategory'].split(',')[1], this.itemImageBase64String);
  
              },
              error: (err : HttpErrorResponse) => {
                console.log(err);
                this.global.showAlert("There was an error creating the sale item. Please try again","Could not create sale item");
              }
            });

          },
          error: err => {
            console.log('ERROR FILE DELETE');
            console.log(err);
          }
        })


      } else {
        //image did not change
        this.global.dismissModal();
        this.saleService.confirmSaleItemModal(2, obj, this.uSaleItemForm.value['itemSCategory'].split(',')[1], this.global.createImg(this.saleItem.photo));

      }

    }
}
