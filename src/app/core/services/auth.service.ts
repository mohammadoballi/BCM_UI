import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { BaseResponse } from "../models/BaseResponse.model";
import { LoginRequest, LoginResponse } from "../models/auth.model";

@Injectable({
    providedIn: 'root'
})


export class AuthService {
    constructor(private apiService: ApiService) { }

    login(loginRequest: LoginRequest): Observable<BaseResponse<LoginResponse>> {
        return this.apiService.post<LoginResponse>('auth/login', {username: loginRequest.username, password: loginRequest.password});
    }
}
