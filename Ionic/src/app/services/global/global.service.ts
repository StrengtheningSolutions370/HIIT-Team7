/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@angular/core';
import { AlertController,LoadingController,ModalController,ToastController } from '@ionic/angular';

declare const Buffer;

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  loading: Boolean = false;
  constructor(private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController) { }

    //IMAGE manipulation
    //--------
    public createImg = (fileName: string) => { 
      return `https://localhost:44383/Resources/Images/saleItemImages/${fileName}`;
    }

    //LOADS
    //------
    toggleLoad() {
      this.loading = !this.loading;
    }

    async nativeLoad(message?, spinner?){
      if(!this.loading) {this.toggleLoad();}
      try {
        const res = await this.loadingCtrl.create({
          message: message,
          spinner: spinner ? spinner : 'bubbles',
          // duration: 3000 //prevents going away till end load is called
        });
        res.present().then(() => {
          if (!this.loading) {
            res.dismiss().then(() => {
              console.log('abort presenting');
            });
          }
        });
      } catch (e) {
        console.log('show loading error: ', e);
      }
    }
  
    async endNativeLoad() {
      if(this.loading) {this.toggleLoad();}
      try {
        await this.loadingCtrl.dismiss();
        return console.log('endNativeLoad');
      } catch (err) {
        return console.log('error ending NativeLoad: ', err);
      }
    }

    //ALERTS
    //------

    async showAlert(message: string, header?: string, buttonArray?:string[]) {
      await this.alertCtrl.create({
        header: header ? header : 'Alert!',
        message: message,
        buttons: buttonArray ? buttonArray : ['Ok']
      })
      .then(alertEl => alertEl.present());
    }

    //TOASTS
    //------

    async showToast(message:string, duration = 2000, position:any = "bottom",  color?:string) {
      const toast = await this.toastCtrl.create({
        message: message,
        duration: duration,
        color: color,
        position: position,
        keyboardClose: true,
        cssClass: 'toastCenter'
      });
      toast.present();
    }

    //MODALS
    //------
    dismissModal() {
      this.modalCtrl.dismiss();
    };

    //JWT DECODER
    //------
    decodeToken(token : string) : any {
      const payload = token.split('.')[1];//takes the paylaod from the tokem
      // const decodeJson = Buffer.from(payload, 'base64').toString();
      // return JSON.parse(decodeJson);
      return JSON.parse(atob(payload));
    }

    validateTokenData(token : any) : boolean {
      const now = Math.trunc(new Date().getTime() / 1000);
      if (token.exp <= now) {
        return false;
      }
      return true;
    }

}
