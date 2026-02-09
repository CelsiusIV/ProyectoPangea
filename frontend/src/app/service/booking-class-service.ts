import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingClassService {
  private apiURL = 'http://localhost:8080/api/booking';
  constructor(private http: HttpClient) { }
  getBookings(): Observable<any> {
    return this.http.get(`${this.apiURL}/api/booking`);
  }

  getBooking(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/api/booking/${id}`)
  }

  getBookingClass(id: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/classes/${id}/bookings`, { withCredentials: true })
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiURL}/api/booking/${id}`);
  }

  post(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/api/booking`, data, {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    });
  }
  put(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiURL}/api/booking/${id}`, data, {
      headers: new HttpHeaders({
        'accept': 'application/json'
      })
    });
  }

}
