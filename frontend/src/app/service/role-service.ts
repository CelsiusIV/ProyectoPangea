import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiConstants } from '../consts/api';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiURL = `${environment.apiDomain}/${apiConstants.ROLES}`;
  constructor(private http: HttpClient) { }
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiURL}`, {withCredentials: true});
  }

  getRole(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`, {withCredentials: true})
  }
}
