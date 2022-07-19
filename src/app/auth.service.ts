import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Remult } from 'remult';
import { GlobalParam } from './globals';
import { User } from './users/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    static loadedFromStorage = false

    constructor(private remult: Remult) {
        AuthService.loadedFromStorage = false
        // console.log('AuthService.constructor')
        const token = AuthService.fromStorage();
        if (token) {
            this.setAuthToken(token);
            AuthService.loadedFromStorage = true
        }
    }

    setAuthToken(token: string | null, rememberOnThisDevice = true) {
        // console.log('setAuthToken - 1', token)
        if (token) {
            // console.log('setAuthToken - 2')
            this.remult.setUser(new JwtHelperService().decodeToken(token));
            sessionStorage.setItem(AUTH_TOKEN_KEY, token);
            if (rememberOnThisDevice) {
                localStorage.setItem(AUTH_TOKEN_KEY, token);
            }
            // this.remult.repo(User).findId(this.remult.user.id, { useCache: false }).finally(() => GlobalParam.allowToStart = res?.allowToStart ?? false)
            // let allowed = checkIfUserApprooved(this.remult)
            // allowed.then(res => GlobalParam.allowToStart = res ?? false)
        }
        else {
            // console.log('setAuthToken - 3')
            this.remult.setUser(undefined!);
            sessionStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            // GlobalParam.allowToStart = false
        }
    }

    static fromStorage(): string {
        return sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY)!;
    }
}

const AUTH_TOKEN_KEY = "tl-authToken";
