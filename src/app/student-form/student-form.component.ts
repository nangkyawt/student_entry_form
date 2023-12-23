import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  constructor(private http: HttpClient, private service: ApiService) {}

  students = {
    id: 0,
    name: '',
    father_name: '',
    date_of_birth: '',
    gender: true,
    nrc_exists: true,
    nrc: '',
  };
  ngOnInit(): void {}
  async savestudent() {
    console.log(this.students);
    await this.service.studentsApiData(this.students).subscribe({
      next: (result: any) => {
        console.log('STUDENTS ADD SUCCESSFULLY!', result);
        this.students = result.data;
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }

  // name = new FormControl(''); //Build Object
  // password = new FormControl('');

  // genderradio = new FormControl('');
  // selectedDate: any;

  // genderradio = new FormControl('');
  // genders = ['male', 'female', 'rathernottosay'];
  toggleNRCInput() {
    throw new Error('Method not implemented.');
  }
  onSubmit() {
    // console.log(this.students.name);
    // console.log(this.students.father_name);
    console.log(this.students);

    // console.log(this.genderradio.value);
  }
  student: any;
  submitForm() {
    throw new Error('Method not implemented.');
  }
}
function toggleNRCInput() {
  throw new Error('Function not implemented.');
}
