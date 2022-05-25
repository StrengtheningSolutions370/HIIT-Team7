/* eslint-disable @typescript-eslint/quotes */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, ViewWillEnter, AlertController } from '@ionic/angular';
import { Venue } from 'src/app/models/venue';
import { VenueService } from 'src/app/services/venue/venue.service';

@Component({
  selector: 'app-delete-venue',
  templateUrl: './delete-venue.component.html',
  styleUrls: ['./delete-venue.component.scss'],
})
export class DeleteVenueComponent implements ViewWillEnter {
  @Input() venue: Venue;

  constructor(private modalCtrl: ModalController, private toastCtrl: ToastController, public formBuilder: FormBuilder,
    public venueService: VenueService, private router: Router, private route: ActivatedRoute, private alertCtrl: AlertController) { }

  ionViewWillEnter() {
    console.log("DeleteVenue - ViewWillEnter");
    console.log(this.venue);
  }

  //Send through the id of the selected venue to be deleted in the venue service.
  async delete(id: number){
    this.venueService.deleteVenue(id);
    this.dismissModal();
    this.sucDelete();
  }

  async sucDelete() {
    const toast = await this.toastCtrl.create({
      message: 'The Venue has been successfully deleted!',
      duration: 2000
    });
    toast.present();
  }

  async failureAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Could not delete Venue',
      message: 'There was an error deleting the venue, please try again.',
      buttons: ['OK']
    });
    alert.present();
  }

  //Close the modal and navigate back to the venue page.
  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
