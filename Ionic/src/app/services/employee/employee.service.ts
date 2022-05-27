/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmployeeType } from 'src/app/models/employeeType';
import { AddEmployeeComponent } from 'src/app/pages/employee/employee-page/add-employee/add-employee.component';
import { AddEtypeComponent } from 'src/app/pages/employee/employee-type/add-etype/add-etype.component';
import { AssociativeEtypeComponent } from 'src/app/pages/employee/employee-type/associative-etype/associative-etype.component';
import { ConfirmEtypeComponent } from 'src/app/pages/employee/employee-type/confirm-etype/confirm-etype.component';
import { DeleteEtypeComponent } from 'src/app/pages/employee/employee-type/delete-etype/delete-etype.component';
import { UpdateEtypeComponent } from 'src/app/pages/employee/employee-type/update-etype/update-etype.component';
import { ViewEtypeComponent } from 'src/app/pages/employee/employee-type/view-etype/view-etype.component';
import { RepoService } from '../repo.service';
import { TitleService } from '../title/title.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  @Output() fetchEmployeeTypesEvent = new EventEmitter<EmployeeType>();

  //Creating a venueList for all the venues in the service.
  private _employeeTypeList = new BehaviorSubject<EmployeeType[]>([]);

  //Return the venue list as an observable.
  public get employeeTypeList() {
    return this._employeeTypeList.asObservable();
  }

  private temp: EmployeeType[];

  constructor(public repo: RepoService, private modalCtrl: ModalController, private alertCtrl: ToastController,
     public titleService: TitleService) {
    //Receive the venues from the repo (API).
    this.repo.getEmployeeTypes().subscribe(result => {
      console.log('Employee Type List: Employee Service -> Get Employee Type');
      console.log(result);

      const tempResult = Object.assign(result);
      this._employeeTypeList.next(tempResult);

      console.log('Employee Type List: Employee Service -> Updated Employee Types');
      console.log(this._employeeTypeList);
    });
  }

  //Methods
  //Add a employee type to the employee type list within the employee service.
  createEmployeeType(employeeType: any) {
    this.repo.createEmployeeType(employeeType).subscribe({
      next: () => {
        console.log('EMPLOYEE TYPE CREATED');
        this.fetchEmployeeTypesEvent.emit(employeeType);
      }
    });
  }

  getAllEmployeeTypes(): Observable<any>{
    return this.repo.getEmployeeTypes();
  }

  //Receives a venue to update in the service venue list.
  async updateEmployeeType(id, employeeType: any){
    return this.repo.updateEmployeeType(employeeType.employeeTypeID,employeeType).subscribe(
      {
       next: () => {
         console.log('EMPLOYEE TYPE UPDATED');
         this.fetchEmployeeTypesEvent.emit(employeeType);
       }
      });
  }

  //Receives a title to delete in the service title list.
  deleteEmployeeType(id: number){
    this.repo.deleteEmployeeType(id).subscribe(result => {
      console.log('EMPLOYEE TYPE DELETED');
      this.fetchEmployeeTypesEvent.emit();
    });
   }

  matchingEmployeeType(input: string) {
    console.log('Employee Service: Repo -> Matching Employee Type');
    this.repo.getMatchEmployeeType(input);
  }

  existingEmployeeType(id: number) {
    console.log('Employee Service: Repo -> Existing Employee Type');
    this.repo.existsEmployeeType(id).subscribe(result =>
      console.log(result));
  }

  //Modals
  async addEmployeeTypeInfoModal(employeeType?: EmployeeType) {
    const modal = await this.modalCtrl.create({
      component: AddEtypeComponent,
      componentProps: {
        employeeType
      }
    });
    await modal.present();
  }

  //Display the update venue modal.
  //This method receives the selected venue object, from the venue page, in the modal through the componentProps.
  async updateEmployeeTypeInfoModal(employeeType: EmployeeType) {
    console.log('Employee Service: Update Employee Modal Call');
    const modal = await this.modalCtrl.create({
      component: UpdateEtypeComponent,
      componentProps: {
        employeeType
      }
    });
    await modal.present();
  }

  //Display the delete venue modal.
  //This method receives the selected venue object, from the venue page, in the modal through the componentProps.
  async deleteEmployeeTypeInfoModal(employeeType: EmployeeType) {
    console.log('Employee Service: Delete Employee Type Modal Call');
    let tempEmployee = new EmployeeType();
    tempEmployee = Object.assign(employeeType);
    console.log(tempEmployee);
    if (tempEmployee.employees != null && tempEmployee.employees.length > 0) {
      const modal = await this.modalCtrl.create({
        component: AssociativeEtypeComponent,
        componentProps: {
          employeeType: tempEmployee
        }
      });
      await modal.present();
    } else {
      const modal = await this.modalCtrl.create({
        component: DeleteEtypeComponent,
        componentProps: {
          employeeType: tempEmployee
        }
      });

      //Update the current venue list with the venue list from the delete modal.
      modal.onDidDismiss().then(() => {
        this.repo.getEmployeeTypes().subscribe(result => {
          const tempResult = Object.assign(result);
          this._employeeTypeList.next(tempResult);
          console.log('Updated employee type list: Employee Service: delete employee type');
          console.log(this._employeeTypeList);
        });
      });
      await modal.present();
    }
  }
  //Display the view venue modal.
  //This method receives the selected venue object, from the venue page, in the modal through the componentProps.
  async viewEmployeeTypeInfoModal(employeeType: EmployeeType) {
    console.log('Employee Service: View Employee Type Modal Call');
    let tempEmployeeType = new EmployeeType();
    tempEmployeeType = Object.assign(employeeType);
    console.log(tempEmployeeType);
    const modal = await this.modalCtrl.create({
      component: ViewEtypeComponent,
      componentProps: {
        employeeType: tempEmployeeType
      }
    });
    await modal.present();
  }

  //Display the confirm create/update modal
  //Receives the selected venue from the venue page
  async confirmEmployeeTypeModal(selection: number, employeeType: any) {
    console.log('Employee Service: Confirm Employee Type Modal Call');
    console.log(selection);
    if (selection === 1) {
      console.log('Performing ADD');
      let tempEmployeeType = new EmployeeType();
      tempEmployeeType.employeeTypeID = 0;
      tempEmployeeType = Object.assign(employeeType);
      console.log(tempEmployeeType);
      const modal = await this.modalCtrl.create({
        component: ConfirmEtypeComponent,
        componentProps: {
          employeeType: tempEmployeeType,
          choice: selection
        }
      });

      //Update the current venue list with the venue list from the confirm modal.
      modal.onDidDismiss().then(() => {
        this.repo.getEmployeeTypes().subscribe(result => {
          const tempResult = Object.assign(result);
          this._employeeTypeList.next(tempResult);
          console.log('Updated employee type list: Employee Service: confirm employee');
          console.log(this._employeeTypeList);
        });
      });
      await modal.present();
    } else if (selection === 2) {
      console.log('Performing UPDATE');
      let tempEmployeeType = new EmployeeType();
      tempEmployeeType = Object.assign(employeeType);
      console.log(tempEmployeeType);
      const modal = await this.modalCtrl.create({
        component: ConfirmEtypeComponent,
        componentProps: {
          employeeType: tempEmployeeType,
          choice: selection
        }
      });
      modal.onDidDismiss().then(() => {
        this.repo.getEmployeeTypes().subscribe(result => {
          const tempResult = Object.assign(result);
          this._employeeTypeList.next(tempResult);
          console.log('Updated employee type list: Employee Service: Update confirm employee');
          console.log(this._employeeTypeList);
        });
      });
      await modal.present();
    } else {
      console.log('BadOption: ' + selection);
    }
  }

  //Employee Modals
  async addEmployeeInfoModal() {
    const modal = await this.modalCtrl.create({
      component : AddEmployeeComponent,
    });
    await modal.present();

  }
}
