import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QualificationType } from 'src/app/models/qualification-type';
import { GlobalService } from 'src/app/services/global/global.service';
import { QualificationService } from 'src/app/services/qualification/qualification.service';

@Component({
  selector: 'app-confirm-qtype',
  templateUrl: './confirm-qtype.component.html',
  styleUrls: ['./confirm-qtype.component.scss'],
})
export class ConfirmQtypeComponent {

  @Input() choice: number;
  @Input() qualificationType: QualificationType;

  constructor(public qualificationService: QualificationService,
    public router: Router, public activated: ActivatedRoute, public global: GlobalService) {
   }

  //1 = confirm ADD
  //2 = confirm UPDATE
  async confirmChanges(qualificationType: QualificationType){
    console.log(this.choice);
    if (this.choice === 1){
      //search duplicates
      if (this.qualificationService.matchingQualificationType(qualificationType.name) != null)
      {
        console.log('Existing Qualification Type: ' + qualificationType.name);
        this.global.showAlert('The qualification type information entered already exists on the system',
        'Duplicate Entry');
        return;
      }
      else {
        console.log('Add Qualification Type from confirm:');
        //CallRepoToCreate
        await this.qualificationService.createQualificationType(qualificationType);
        this.global.dismissModal();
        this.global.showToast('The qualification type has been successfully added!');
      }
    }

     else if (this.choice === 2){
      if (this.qualificationService.matchingQualificationType(qualificationType.name) != null)
      {
        console.log('Existing Qualification Type: ' + qualificationType.name);
        this.global.showAlert('The qualification type information entered already exists on the system',
        'Duplicate Entry');
        return;
      }
      else {
      console.log('Update Qualification Type from confirm:');
      //CallRepoToUpdate
      await this.qualificationService.updateQualificationTypes(qualificationType.qualificationTypeID,qualificationType);
      this.global.dismissModal();
      this.global.showToast('The qualification type has been successfully updated!');
      }
    }
  }

  async returnFrom(){
      //1 = return to ADD
      //2 = return to UPDATE
    if (this.choice === 1){
      console.log(this.qualificationType);
      this.global.dismissModal();
      this.qualificationService.addQualificationTypeInfoModal(this.qualificationType);
    }
    else if (this.choice === 2){
      console.log(this.qualificationType);
      this.global.dismissModal();
      this.qualificationService.updateQualificationTypeInfoModal(this.qualificationType);
    }
  }
}
