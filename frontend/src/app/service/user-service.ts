import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'

})
/*
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post('http://localhost:8080/api/login', credentials, {
      // 🌟 Esta línea es CRÍTICA para que el navegador confíe en las respuestas CORS
      withCredentials: true 
    });
  }
}*/
export class UserService {

  private apiURL = 'http://localhost:8080/api/users';
  constructor(private http: HttpClient) { }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiURL}`, {withCredentials: true});
    //return this.http.get('http://localhost:8080/api/debug-auth', {withCredentials: true});
  }

  getUser(id:number): Observable<any>{
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
