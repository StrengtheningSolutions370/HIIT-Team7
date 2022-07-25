/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { EventEmitter, Injectable, Output } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { EmployeeType } from 'src/app/models/employeeType';
import { AddEtypeComponent } from 'src/app/pages/employee/employee-type/add-etype/add-etype.component';
import { AssociativeEtypeComponent } from 'src/app/pages/employee/employee-type/associative-etype/associative-etype.component';
import { ConfirmEtypeComponent } from 'src/app/pages/employee/employee-type/confirm-etype/confirm-etype.component';
import { DeleteEtypeComponent } from 'src/app/pages/employee/employee-type/delete-etype/delete-etype.component';
import { UpdateEtypeComponent } from 'src/app/pages/employee/employee-type/update-etype/update-etype.component';
import { ViewEtypeComponent } from 'src/app/pages/employee/employee-type/view-etype/view-etype.component';

import { Employee } from 'src/app/models/employee';
import { AddEmployeeComponent } from 'src/app/pages/employee/employee-page/add-employee/add-employee.component';
import { AssociativeEmployeeComponent } from 'src/app/pages/employee/employee-page/associative-employee/associative-employee.component';
import { ConfirmEmployeeComponent } from 'src/app/pages/employee/employee-page/confirm-employee/confirm-employee.component';
import { DeleteEmployeeComponent } from 'src/app/pages/employee/employee-page/delete-employee/delete-employee.component';
import { UpdateEmployeeComponent } from 'src/app/pages/employee/employee-page/update-employee/update-employee.component';
import { ViewEmployeeComponent } from 'src/app/pages/employee/employee-page/view-employee/view-employee.component';

import { RepoService } from '../repo.service';
import { TitleService } from '../title/title.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  @Output() fetchEmployeesEvent = new EventEmitter<Employee>();
  @Output() fetchEmployeeTypesEvent = new EventEmitter<EmployeeType>();

//Creating an employee list for all the employees in the service
private _employeeList = new BehaviorSubject<Employee[]>([]);

//Return the employee list as an observable
public get employeeList(){
  return this._employeeList.asObservable();
}

private tempE : Employee[];

  constructor(public repo: RepoService, private modalCtrl: ModalController,
    public titleService: TitleService) {
    //Receive the employee types from the repo (API).
    this.getAllEmployeeTypes();

    //Receive the employees from the repo (API)
    this.repo.getEmployees().subscribe(result => {
      console.log('Employee List: Employee Service -> Get Employees');
      console.log(result);
      const tempResult = Object.assign(result);
      this._employeeList.next(tempResult);
      console.log('Employee List: Employee Service -> Updated Employees');
      console.log(this._employeeList);
    })
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

  //Add an employee to the employee list within the employee service
  createEmployee(employee: any){
    const today = new Date();
    const employeeTemp = {
      //employee class/model
      Name : employee.Name,
      Surname : employee.Surname,
      Photo: employee.Photo,
      IDNumber: employee.IDNumber,
      Phone: employee.Phone,
      Email: employee.Email,
      TitleID: employee.TitleID,
      EmployeeTypeID: employee.EmployeeTypeID,
      QualificationID: employee.QualificationID,
      QualificationTypeID: employee.QualificationTypeID,
      Contract: employee.Contract
    };
    this.repo.createEmployee(employeeTemp).subscribe(
      {
        next: () => {
          console.log('EMPLOYEE CREATED');
          this.fetchEmployeesEvent.emit(employee);
        }
      }
    );
   }

   getAllEmployees(): Observable<any> {
    return this.repo.getEmployees();
  }

  //Receives an employee type to update in the service venue list.
  updateEmployeeType(id: number, employeeType: any) {
    if (id !== employeeType.employeeTypeID) {
      console.log("ERROR IN EMPLOYEE TYPE UPDATE - MISMATCH ID");
      return;
    }
    return this.repo.updateEmployeeType(id, employeeType).subscribe(
      {
        next: () => {
          console.log('VENUE UPDATED');
          this.fetchEmployeeTypesEvent.emit(employeeType);
        }
      }
    );
  }

  //Receives an employee to update in the service employee list
  async updateEmployee(employee: any) {
    return this.repo.updateEmployee(employee).subscribe(
      {
       next: () => {
         console.log('EMPLOYEE UPDATED');
         this.fetchEmployeesEvent.emit(employee);
       },
       error: err => {
         console.log('EMPLOYEE UPDATED FAILED');
       }
      }
    );
  }



  //Receives a employee type to delete in the service employee list.
  deleteEmployeeType(id: number) {
    this.repo.deleteEmployeeType(id).subscribe(result => {
      console.log('VENUE DELETED');
      this.fetchEmployeeTypesEvent.emit();
    });
  }

    //Receives an employee to delete in the service employee list.
    deleteEmployee(id: number){
      console.log('HERE = ' + id);
    this.repo.deleteEmployee(id).subscribe(
      {
        next: res => {
          console.log(res);
          console.log('EMPLOYEE DELETED');
          this.fetchEmployeesEvent.emit();
        },
        error: err => {
          console.log('ÉRROR HERE');
          console.log(err);
        }
      }
    );
    }

  getAllEmployeeTypes(): Observable<any> {
    return this.repo.getEmployeeTypes();
  }



  matchingEmployeeType(name: string): Promise<any>{
    return this.repo.getMatchEmployeeType(name).toPromise();
   }

   //matching employee
   matchingEmployee(input: string){
    console.log('employeeService: Repo -> Matching employee');
    this.repo.getMatchEmployee(input);
   }

  existingEmployeeType(id: number) {
    console.log('Employee Service: Repo -> Existing Employee Type');
    //this.repo.existsEmployeeType(id).subscribe(result =>
      //console.log(result));
  }

  //existing employee
  // existingEmployee(id: number){
  //   console.log('employeeService: Repo -> Existing Employee');
  //   this.repo.existsEmployee(id).subscribe(result =>
  //    console.log(result));
  //  }

  //Modals
  //Add employee info modal
  async addEmployeeInfoModal(employee?: Employee) {
    const modal = await this.modalCtrl.create({
      component: AddEmployeeComponent,
      componentProps:{
        employee
      }
    });
    await modal.present();
  }

  //add employee type
  async addEmployeeTypeInfoModal(employeeType?: EmployeeType) {
    const modal = await this.modalCtrl.create({
      component: AddEtypeComponent,
      componentProps: {
        employeeType
      }
    });
    await modal.present();
  }

  //Display the update employee modal.
  //This method receives the selected employee object, from the employee page, in the modal through the componentProps.
  async updateEmployeeInfoModal(employee: Employee) {
    console.log('EmployeeService: UpdateEmployeeModalCall');
    const modal = await this.modalCtrl.create({
      component: UpdateEmployeeComponent,
      componentProps:{
        employee
      }
    });
    await modal.present();
  }

  //Display the update employee type modal.
  //This method receives the selected employee type object, from the employee type page, in the modal through the componentProps.
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
    console.log("VenueService: DeleteVenueModalCall");
    if (employeeType.employees != null && employeeType.employees.length > 0){
      const modal = await this.modalCtrl.create({
        component: AssociativeEtypeComponent,
          componentProps: {
            employeeType
        }
      });
      await modal.present();
    } else {
      const modal = await this.modalCtrl.create({
        component: DeleteEtypeComponent,
          componentProps: {
            employeeType
        }
      });
      await modal.present();
    }
  }

  //Display the delete employee modal.
  //This method receives the selected employee object, from the employee page, in the modal through the componentProps.
  async deleteEmployeeInfoModal(employee: Employee) {
    console.log('EmployeeService: DeleteEmployeeModalCall');

      const modal = await this.modalCtrl.create({
        component: DeleteEmployeeComponent,
          componentProps: {
            employee,
        }
      });

      //Update the current employee list with the employee list from the delete modal.
      modal.onDidDismiss().then(() => {
        this.repo.getEmployees().subscribe(result => {
          const tempResult = Object.assign(result);
          this._employeeList.next(tempResult);
          console.log('Updated employee list: Employee Service: delete employee');
          console.log(this._employeeList);
        });
      });
      await modal.present();
    }

  //Display the view employee type modal.
    //This method receives the selected employee type object, from the employee type page, in the modal through the componentProps.
    async viewEmployeeTypeInfoModal(employeeType: EmployeeType) {
      console.log("VenueService: ViewVenueModalCall");
      const modal = await this.modalCtrl.create({
        component: ViewEtypeComponent,
        componentProps: {
          employeeType
        }
      });
      await modal.present();
    }

 //Display the view employee modal.
    //This method receives the selected employee object, from the employee page, in the modal through the componentProps.
    async viewEmployeeInfoModal(employee: Employee) {
      console.log('EmployeeService: ViewEmployeeModalCall');
      let tempEmployee = new Employee();
      tempEmployee = Object.assign(employee);
      console.log(tempEmployee);
      const modal = await this.modalCtrl.create({
        component: ViewEmployeeComponent,
        componentProps: {
          employee:tempEmployee
        }
      });
      await modal.present();
    }


  //Display the confirm create/update modal
  //Receives the selected venue from the venue page
  async confirmEmployeeTypeModal(choice: number, employeeType: any) {
    console.log('VenueService: ConfirmVenueModalCall');
    console.log(choice);
    if(choice === 1){
      console.log("Performing ADD");
      const modal = await this.modalCtrl.create({
        component: ConfirmEtypeComponent,
        componentProps: {
          employeeType,
          choice
        }
      });
      await modal.present();
    } else if (choice === 2){
      console.log("Performing UPDATE");
      const modal = await this.modalCtrl.create({
        component: ConfirmEtypeComponent,
        componentProps: {
          employeeType,
          choice
        }
      });
      await modal.present();
    } else {
      console.log("BadOption: " + choice)
    }
  }

    //Display the confirm create/update modal
  //Receives the selected employee from the employee page
  async confirmEmployeeModal(choice: number, employee: any, employeeTypeName: string, qualificationDescription: string, qTypeName: string, title: string, image: any) {
    console.log('EmployeeService: ConfirmEmployeeModalCall');
    console.log(choice);
    if(choice === 1){
      console.log('Performing ADD');
      const modal = await this.modalCtrl.create({
        component: ConfirmEmployeeComponent,
        componentProps: {
          employee,
          choice,
          employeeTypeName,
          qualificationDescription,
          qTypeName,
          title,
          image
        }
      });

      //Update the current vat list with the vat list from the confirm modal.
      modal.onDidDismiss().then(() => {

        this.repo.getEmployees();

      });

      await modal.present();

    } else if (choice === 2){

      console.log('Performing UPDATE');


      const modal = await this.modalCtrl.create({
        component: ConfirmEmployeeComponent,
        componentProps: {
          employee,
          choice,
          employeeTypeName,
          qualificationDescription,
          qTypeName,
          title,
          image
        }
      });
      modal.onDidDismiss().then(() => {
        // this.repo.getSaleItems();
        // this.updateSaleItemInfoModal(saleItem);
      });
      await modal.present();
    } else {
      console.log('BadOption: ' + choice);
    }
  }

  async associativeEmployeeTypeModal(employeeType: EmployeeType) {
    console.log("EmployeeTypeService: AssociativeModalCall");
    const modal = await this.modalCtrl.create({
      component: AssociativeEtypeComponent,
      componentProps: {
        employeeType
      }
    });
    await modal.present();
  }
}

