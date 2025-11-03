import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BaseResponse } from "../models/BaseResponse.model";
import { environment } from "../../env/development.env";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

get<T>(url: string, options?: { params?: any; headers?: any }): Observable<BaseResponse<T>> {
  const fullUrl = `${environment.BaseURL}/${url}`;
  return this.http.get<BaseResponse<T>>(fullUrl, {
    ...options,
    observe: 'body',      
    responseType: 'json',  // 👈 ensures type is parsed as JSON
  });
}



  post<T>(url: string, data: any): Observable<BaseResponse<T>> {
    return this.http.post<BaseResponse<T>>(`${environment.BaseURL}/${url}`, data);
  }

  put<T>(url: string, data: any): Observable<BaseResponse<T>> {
    return this.http.put<BaseResponse<T>>(`${environment.BaseURL}/${url}`, data);
  }

  delete<T>(url: string): Observable<BaseResponse<T>> {
    return this.http.delete<BaseResponse<T>>(`${environment.BaseURL}/${url}`);
  }
}