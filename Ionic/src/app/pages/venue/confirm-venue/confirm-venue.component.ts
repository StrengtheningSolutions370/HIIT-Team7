/* eslint-disable no-var */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/quotes */
import { Component, Input} from '@angular/core';
import { Venue } from 'src/app/models/venue';
import { GlobalService } from 'src/app/services/global/global.service';
import { VenueService } from 'src/app/services/venue/venue.service';

@Component({
  selector: 'app-confirm-venue',
  templateUrl: './confirm-venue.component.html',
  styleUrls: ['./confirm-venue.component.scss'],
})
export class ConfirmVenueComponent {
  
  //1 = confirm ADD
  //2 = confirm UPDATE
  @Input() choice: number;
  @Input() venue: Venue;

  constructor(public venueService: VenueService, public global: GlobalService) {}


  async checkMatch(name:string, address:string): Promise<boolean>{
   return this.venueService.matchingVenue(name,address).then(result => {
     console.log(result);
      if (result != false){
        this.global.showAlert("The venue information entered already exists on the system","Venue Already Exists");
        return true;
      } else {
        return false;
      }
    });
  }

  async confirmChanges(venue: Venue){
    console.log(venue);
    await this.checkMatch(venue.name,venue.address).then(result =>{
      console.log(result);
      if (result == true){
         return;       
       } else {
        if (this.choice === 1){
            console.log('Add Venue from confirm:');
            //CallRepoToCreate
            this.venueService.createVenue(venue);
            this.global.showToast("The venue has been successfully added!");
        } else if (this.choice === 2){
            console.log('Update Venue from confirm:');
            //CallRepoToUpdate
            this.venueService.updateVenue(venue.venueID,venue);
            this.global.showToast("The venue has been successfully updated!");
        }
      }
          //dismiss modal
          this.global.dismissModal();
    }); 

  }

  returnFrom(){
      //1 = return to ADD
      //2 = return to UPDATE
    if (this.choice === 1){
      console.log(this.venue);
      this.global.dismissModal();
      this.venueService.addVenueInfoModal(this.venue);
    } else if (this.choice === 2){
      console.log(this.venue);
      this.global.dismissModal();
      this.venueService.updateVenueInfoModal(this.venue);
    }
  }

}
