import { Component, Input } from '@angular/core';
import { BookingType } from 'src/app/models/booking-type';
import { BookingService } from 'src/app/services/booking/booking.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-delete-btype',
  templateUrl: './delete-btype.component.html',
  styleUrls: ['./delete-btype.component.scss'],
})
export class DeleteBtypeComponent  {
  @Input() bookingType: BookingType;

  constructor(private global: GlobalService,
    public bookingService: BookingService) { }


  //Send through the id of the selected exercise category to be deleted in the exercise category service.
  async delete(){
    this.bookingService.deleteBookingType(this.bookingType.bookingTypeID);
    this.global.dismissModal();
    this.global.showToast("The Exercise Category has been successfully deleted")
  }

}
