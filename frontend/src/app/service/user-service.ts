import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiConstants } from '../consts/api';

@Injectable({
  providedIn: 'root'

})

export class UserService {

  private apiURL = `${environment.apiDomain}/${apiConstants.USERS}`;
  constructor(private http: HttpClient) { }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiURL}`, {withCredentials: true});
  }

  getUser(id:number): Observable<any>{
    return this.http.get(`${this.apiURL}/${id}`)
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`, {withCredentials: true});
  }

  post(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}`, data, {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    });
  }
  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${id}`, data, {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    });
  }
}
