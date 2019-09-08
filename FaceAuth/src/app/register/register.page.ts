import { Component, OnInit ,ViewChild, ElementRef} from '@angular/core';
import {ActionSheetController,LoadingController} from '@ionic/angular';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { FileChooser  } from '@ionic-native/file-chooser/ngx';
import { AlertService } from 'src/app/services/alert/alert.service';
import  { AuthenticationService } from 'src/app/services/authentication/authentication.service';

declare var faceapi;



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})








export class RegisterPage implements OnInit {

 @ViewChild('registerImage',{static:false}) registerImage:ElementRef;

  public form = {
    name:null,
    email:null,
    password:null,
    image:null  
  }
  public response:any;
  constructor(
    public actionSheetController:ActionSheetController,
    public camera:Camera,
    public filechooser:FileChooser,
    public loadingController: LoadingController,
    public alert:AlertService,
    public authService:AuthenticationService
    ) 
  {

   }

   

  ngOnInit() {
  }

  async loadActionSheet()
  {
     const actionSheet = await this.actionSheetController.create({
       header: 'Choose An Image',
       buttons: [{
         text: 'Camera',
         icon: 'camera',
         handler: () => {
         this.loadCamera();      
         }
       }, {
         text: 'image',
         icon: 'images',
         handler: () => {
           this.loadFileChooser();
         }
       }, {
         text: 'Cancel',
         icon: 'close',
         role: 'cancel',
         handler: () => {
           console.log('Cancel clicked');
         }
       }]
     });
   
     await actionSheet.present();
   }


  


  loadFileChooser () {
    let cameraOptions = this.cameraOptions(this.camera.PictureSourceType.PHOTOLIBRARY);
   this.camera.getPicture(cameraOptions).then(async (imageData)=>{
     console.log(imageData);
     let finalData = 'data:image/jpeg;base64,'+imageData;
     this.form.image = finalData;
    let UserImage = this.registerImage.nativeElement.querySelector("#user_image"); 
  const loading = await this.loadingController.create({message:'checking for human faces..'
  ,spinner:'crescent'});
   loading.present().then( async ()=>{
    await faceapi.nets.ssdMobilenetv1.loadFromUri("https://www.techbuildz.com/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("https://www.techbuildz.com/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("https://www.techbuildz.com/models");
   const checkImage = await faceapi.detectAllFaces(UserImage).
   withFaceLandmarks().withFaceDescriptors();
   console.log(checkImage)
   console.log(checkImage.length)
   if(!checkImage.length)
   {

     loading.dismiss();
     return this.alert.presentAlert("error","error","no face was detected on this image");
   }
  
   if(checkImage.length > 1)
   {
    loading.dismiss();
    return this.alert.presentAlert("error","error","only a single face is accepted");
   }
     loading.dismiss();
   })

    
   })
  }

  cameraOptions(sourceType)
  {
    let options:CameraOptions = {
      quality:100,
      sourceType:sourceType,
      saveToPhotoAlbum:false,
      correctOrientation:true,
      allowEdit:false,
      destinationType:this.camera.DestinationType.DATA_URL,
      mediaType:this.camera.MediaType.PICTURE,
      encodingType:this.camera.EncodingType.JPEG,
      targetHeight:500,
      targetWidth:500,
    }

    return options;
  }

  loadCamera ()
  {
    let cameraOptions = this.cameraOptions(this.camera.PictureSourceType.CAMERA);
   this.camera.getPicture(cameraOptions).then(async(imageData)=>{
     console.log(imageData);     
     let finalData = 'data:image/jpeg;base64,'+imageData;
     this.form.image = finalData;
    let UserImage = this.registerImage.nativeElement.querySelector("#user_image"); 
  const loading = await this.loadingController.create({message:'checking for human faces..'
  ,spinner:'crescent'});
   loading.present().then( async ()=>{
    await faceapi.nets.ssdMobilenetv1.loadFromUri("https://www.techbuildz.com/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("https://www.techbuildz.com/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("https://www.techbuildz.com/models");
   const checkImage = await faceapi.detectAllFaces(UserImage).withFaceLandmarks().withFaceDescriptors();
   console.log(checkImage)
   if(!checkImage.length)
   {
     loading.dismiss();
     return this.alert.presentAlert("error","error","no face was detected on this image");
   }
  
   if(checkImage.length > 1)
   {
    loading.dismiss();
    return this.alert.presentAlert("error","error","only a single face is accepted");
   }
    loading.dismiss();
   },
   error=>{
     console.log(error)
     this.alert.presentAlert("error","error","there seems to be a problem please try again later");
   })
   }) 
  }




  async register()
  {
    const loading = await this.loadingController.create({message:'registering your credentials please wait..',
  spinner:'crescent'});
    loading.present().then( async ()=>{
     console.log(this.form);
     this.authService.Register(this.form).then((data)=>{
       console.log(data)
       this.response = data;
       if(this.response.hasOwnProperty('success') && this.response.success==true)
       {
         loading.dismiss();
        return this.alert.presentAlert("success","new user",this.response.message);

       }else{
         loading.dismiss();
       return this.alert.presentAlert("failed","failed",this.response.message)
       }
     },
     error=>{
       console.log(error)
       loading.dismiss();
      return this.alert.presentAlert("error","error","there seems to be a problem please try again later")
     }
     ) 

    })
  }

}
