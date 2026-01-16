import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiURL = 'http://localhost:8080/api/roles';
  constructor(private http: HttpClient) { }
  getRoles(): Observable<any> {
    return this.http.get(`${this.apiURL}`, {withCredentials: true});
  }

  getRole(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`, {withCredentials: true})
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
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
