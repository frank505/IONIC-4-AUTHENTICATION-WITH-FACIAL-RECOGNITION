import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

 public url:string = "http://localhost:8000/api"

public added_link:string;
public data:any;
public post_response:any;
public header:any;

  constructor(public Http:HttpClient) 
  {

   }

   setHeaders(token)
   {
     let header = new HttpHeaders();
     if(token==null)
     {
       header = header.set("Content-type","aplication/json");
     }else{
       header = header.set("Authorization",token);
     }
     return header;
   }


   postData(item,added_url,token?:any)
   {
  return this.Http.post(this.url+added_url,item,{headers:this.setHeaders(token)})
   }

   getData(added_url,token?:any)
   {
     return this.Http.get(this.url+added_url,{headers:this.setHeaders(token)});
   }
   putData(item,added_url,token?:any)
   {
     return this.Http.put(this.url+added_url,item,{headers:this.setHeaders(token)});
   }
   
   deleteData(added_url,token?:any)
   {
     return this.Http.delete(this.url+added_url,{headers:this.setHeaders(token)});
   }
  

}
