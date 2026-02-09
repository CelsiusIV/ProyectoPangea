import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiConstants } from '../consts/api';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiURL = `${environment.apiDomain}/${apiConstants.PAYMENTS}`;
  constructor(private http: HttpClient) { }
  getPayments(): Observable<any> {
    return this.http.get(`${this.apiURL}`, { withCredentials: true });
  }

  getPayment(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`, { withCredentials: true })
  }

  getUserPayment(id: number): Observable<any>{
    return this.http.get(`http://localhost:8080/api/users/${id}/payments`, { withCredentials: true })
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${id}`);
  }

  post(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}`, data, { withCredentials: true });
  }
  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${id}`, data, {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    });
  }
}
