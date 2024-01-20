import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  studentsApiData(data: any) {
    return this.http.post(`http://localhost:3000/api/v1/students`, data);
  }
  getstudents() {
    return this.http.get(`http://localhost:3000/api/v1/students`);
  }
  destroystudents(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/students/${id}`);
  }

  updatestudents(id: any, data: any) {
    return this.http.patch(`http://localhost:3000/api/v1/students/${id}`, data);
  }
  bulkCreate(data: any) {
    return this.http.post(
      `http://localhost:3000/api/v1/students/bulkCreate`,
      data
    );
  }
  examResultApiData(data: any) {
    return this.http.post('http://localhost:3000/api/v1/examresults', data);
  }
  findall(data: any) {
    return this.http.post(`http://localhost:3000/api/v1/examresults`, data);
  }
  getMarks(id: any) {
    return this.http.get(`http://localhost:3000/api/v1/examresults/${id}`);
  }
  deleteMarks(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/examresults/${id}`);
  }
}
