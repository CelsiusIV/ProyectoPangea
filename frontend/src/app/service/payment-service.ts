import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { apiConstants } from '../consts/api';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiURL = `${environment.apiDomain}`;
  constructor(private http: HttpClient) { }
  getPayments(): Observable<any> {
    return this.http.get(`${this.apiURL}/${apiConstants.PAYMENTS}`, { withCredentials: true });
  }

  getPayment(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${apiConstants.PAYMENTS}/${id}`, { withCredentials: true })
  }

  getUserPayment(id: number): Observable<any>{
    return this.http.get(`${this.apiURL}/${apiConstants.USERS}/${id}/payments`, { withCredentials: true })
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/${apiConstants.PAYMENTS}/${id}`);
  }

  post(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/${apiConstants.PAYMENTS}`, data, { withCredentials: true });
  }
  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/${apiConstants.PAYMENTS}/${id}`, data, {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    });
  }
}
