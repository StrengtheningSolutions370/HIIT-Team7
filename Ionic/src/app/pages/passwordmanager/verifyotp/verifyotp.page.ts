import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global/global.service';
import { RepoService } from 'src/app/services/repo.service';
import { StoreService } from 'src/app/services/storage/store.service';

@Component({
  selector: 'app-verifyotp',
  templateUrl: './verifyotp.page.html',
  styleUrls: ['./verifyotp.page.scss'],
})
export class VerifyotpPage implements OnInit {

  error = false;
  errormsg = '';

  constructor(private global : GlobalService, private repo : RepoService, private router : Router, private storage : StoreService) { }

  ngOnInit() {
  }

  onSubmit(form : NgForm) {
    const otp = form.control.get('otp').value;

    
    this.storage.getKey('email').then((email) => {
      const uvm = {
        EmailAddress: email,
        OTP: otp
      }
      this.global.nativeLoad("Verifying...");
      this.repo.VerifyOtp(uvm).subscribe({
        next: () => {
          this.router.navigate(['/password/create'])
        },
        error: () => {
          this.error = true;
          this.errormsg = 'Incorrect OTP provided.';
        }
      }).add(() => { this.global.endNativeLoad(); });
    })

  }
  

}
