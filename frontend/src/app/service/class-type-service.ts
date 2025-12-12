import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassTypeService {
  private apiURL = 'http://127.0.0.1:8080/api/class_types';
  constructor(private http: HttpClient) { }
  getClassTypes(): Observable<any> {
    return this.http.get(`${this.apiURL}`);
  }

  getClassType(id: number): Observable<any> {
    return this.http.get(`${this.apiURL}/${id}`)
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
