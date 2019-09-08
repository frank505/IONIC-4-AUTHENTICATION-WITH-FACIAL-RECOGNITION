import { Component,ViewChild,ElementRef } from '@angular/core';
import {LoadingController } from '@ionic/angular';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {AlertService} from 'src/app/services/alert/alert.service';
import {Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';


declare var faceapi;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
 
@ViewChild('loginImages',{static:false}) loginImages:ElementRef; 


 public form = {
   email:null,
   password:null
 }

 public error_response:any;
  public success_response:any;

  constructor(
    public loadingController: LoadingController,
    public authService:AuthenticationService,
    public alert:AlertService,
    public camera:Camera,
    public router:Router
  )
   {

   }

   

async login()
{
 const loading = await this.loadingController.create({message:'please wait...',spinner:'crescent'});
 loading.present().then(()=>{
 this.authService.Login(this.form).then((data)=>{
  console.log(data)
  this.success_response = data;
  if(this.success_response.success==true &&  this.success_response.hasOwnProperty("token"))
  {
   loading.dismiss();
   this.facialRecognition(this.success_response.token,this.success_response.image);
  }else{
    loading.dismiss();
    this.alert.presentAlert("error","error",this.success_response.message);
  }
 },
 error=>{
   loading.dismiss();
   this.error_response = error;
   this.alert.presentAlert("error","error", this.error_response.message);
   console.log(error)
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

async facialRecognition(token,authImageUrl)
{
  let options = this.cameraOptions(this.camera.PictureSourceType.CAMERA);
  this.camera.getPicture(options).then(async(imageData)=>{
    let imageFromApp = this.loginImages.nativeElement.querySelector("#image_from_app");
    imageFromApp.src = 'data:image/jpeg;base64,' + imageData;
    const loading = await this.loadingController.create({message:'facial recognition in action please wait..'
  ,spinner:'crescent'});
  console.log(imageFromApp);
   loading.present().then( async ()=>{
    await faceapi.nets.ssdMobilenetv1.loadFromUri("https://www.techbuildz.com/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("https://www.techbuildz.com/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("https://www.techbuildz.com/models");
   const checkImage = await faceapi.detectAllFaces(imageFromApp).withFaceLandmarks().withFaceDescriptors();
  // this.loginImageData.image_from_server = authImageUrl;
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
  
   var imageFromServer = this.loginImages.nativeElement.querySelector("#image_from_server");
   imageFromServer.src = authImageUrl;
    const faceMatcher = new faceapi.FaceMatcher(checkImage);
    console.log(faceMatcher);

    const singleResult = await faceapi
    .detectSingleFace(imageFromServer)
    .withFaceLandmarks()
    .withFaceDescriptor();
 if(singleResult)
 {
   const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
   console.log(bestMatch);  
   if(bestMatch.hasOwnProperty("_label") && bestMatch._label!="unknown"){ //is the for the default standard 0.6
    if(bestMatch.distance >=0.4){
      loading.dismiss();
      this.alert.presentAlert("error","error","this is not your face please try again");
    }else{
       
      loading.dismiss();
      this.router.navigateByUrl("profile");
    }
   }else{
     loading.dismiss();
     this.alert.presentAlert("error","error","this is not your face you cant login right now");
   }
 }

     loading.dismiss();

   })
    
  
  
  }) 
}


}
