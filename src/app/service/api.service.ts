import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private studentId: string | null = null;
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
    return this.http.post(`http://localhost:3000/api/v1/examresults`, data);
  }
  findall() {
    return this.http.get(`http://localhost:3000/api/v1/examresults`);
  }
  getMarks(id: any) {
    return this.http.get(`http://localhost:3000/api/v1/examresults/${id}`);
  }
  updateMarks(id: any, data: any) {
    return this.http.patch(
      `http://localhost:3000/api/v1/examresults/${id}`,
      data
    );
  }
  deleteMarks(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/examresults/${id}`);
  }
  deleteAllByStudentId(id: any) {
    return this.http.delete(`http://localhost:3000/api/v1/examresults/${id}`);
  }
  bulkcreate(data: any) {
    return this.http.post(
      `http://localhost:3000/api/v1/examresults//bulkCreate`,
      data
    );
  }
  setStudentId(studentId: string | null) {
    this.studentId = studentId;
  }
  getStudentId(): string | null {
    return this.studentId;
  }
}
