import { HttpClient } from '@angular/common/http';
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

  private apiURL = 'http://127.0.0.1:8080/api/users';
  constructor(private http: HttpClient) { }
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiURL}`);
  }

}
