import { Injectable } from '@angular/core';
import {ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(public toastController:ToastController) 
  {

   }


   async presentToastWithOptions(message,position)
   {
       const toast = await this.toastController.create({
         message:message,
         showCloseButton:true,
         position:position, //'top' or 'bottom'
         animated:true
       });
       toast.present();
      }

  async presentFadeToast(message,time,position)
 {
     const toast = await this.toastController.create({
       message: message,
       duration: time,
       position:position,
       animated:true
     });
     toast.present();
}

}
