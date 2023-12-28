import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  data: any;

  constructor(private http: HttpClient, private service: ApiService) {}
  results: any = [];
  students = {
    id: 0,
    name: '',
    father_name: '',
    date_of_birth: '',
    gender: true,
    nrc_exists: true,
    nrc: '',
  };
  ngOnInit(): void {
    this.getstudent();
  }
  // radio button
  gendermale() {
    this.students.gender = false;
  }
  genderfemale() {
    this.students.gender = true;
  }

  // Add
  async savestudent() {
    console.log(this.students);
    await this.service.studentsApiData(this.students).subscribe({
      next: (result: any) => {
        console.log('STUDENTS ADD SUCCESSFULLY!', result);
        this.getstudent();
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }

  // FindAll
  async getstudent() {
    console.log('>>>>>>ERROR>>>>');
    await this.service.getstudents().subscribe({
      next: (result: any) => {
        console.log('ADD SUCCESSFULLY!', result);
        this.results = result.data;
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }

  // Delete
  async deletestudent(id: number) {
    await this.service.destroystudents(id).subscribe({
      next: (result: any) => {
        console.log('Student Deleted!');
        this.getstudent();
      },
      error: (error: any) => {
        alert('FAIL!');
      },
    });
  }

  // Update
  async updatestudent(id: any) {
    var updatedata = {
      id: 0,
      name: '',
      father_name: '',
      date_of_birth: '',
      gender: true,
      nrc_exists: true,
      nrc: '',
    };
    await this.service.updatestudents(id, updatedata).subscribe({
      next: (result: any) => {
        console.log('Updated Successfully!');
        this.getstudent();
      },
      error: (error: any) => {
        alert('FAIL!');
      },
    });
  }

  toggleNRCInput() {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
    console.log(this.students);
  }
  student: any;
  submitForm() {
    throw new Error('Method not implemented.');
  }
}
function toggleNRCInput() {
  throw new Error('Function not implemented.');
}
