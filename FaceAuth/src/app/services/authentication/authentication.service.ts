import { Injectable } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http/http-service.service';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public http:HttpServiceService)
   { 

   }

 Register(RegisterData):any
 {
 return  this.http.postData(RegisterData,"/user/register").toPromise();
 }

 Login(LoginData):any
 {
 return this.http.postData(LoginData,"/user/login").toPromise();
 }

}
