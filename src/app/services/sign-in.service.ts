import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../User';
import { shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';

const httpOptions:Object ={
  headers: new HttpHeaders({
    'Content-Type':'application/json',
  }),
  observe: 'response'
}

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  private apiUrl = "https://wiley-events-4086e0df4568.herokuapp.com/signin";
  //private apiUrl = "http://localhost:5000/signin"

  constructor(private http: HttpClient, private router: Router) { }

  login(user: User): Observable<any>{
    return this.http.post(`${this.apiUrl}/users/login`,user,httpOptions).pipe(
      <any>shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, <string>res.headers.get('x-access-token'), <string>res.headers.get('x-refresh-token'));
        console.log("Successfully logged in!");
        console.log(res)
      })
  )}

  register(user: User): Observable<any>{
    return this.http.post(`${this.apiUrl}/users/register`,user,httpOptions).pipe(
      <any>shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(res.body._id, <string>res.headers.get('x-access-token'), <string>res.headers.get('x-refresh-token'));
        console.log("Successfully signed up !");
        console.log(res)
      })
  )}

  logout(){
    this.removeSession();

    this.router.navigate(['/signin']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }


  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
  }

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken() {
    return this.http.get(`${this.apiUrl}/users/me/access-token`, {
      headers: new HttpHeaders({
        "x-refresh-token": this.getRefreshToken()!,
        '_id': this.getUserId()!
      }),
      observe: 'response'
    }).pipe(
      tap((res: HttpResponse<any>) => {
        this.setAccessToken(res.headers.get('x-access-token')!);
      })
    )
  }

}
