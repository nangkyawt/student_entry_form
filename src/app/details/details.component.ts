import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { StudentFormComponent } from '../student-form/student-form.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  studentRoute: any;
  constructor(
    private http: HttpClient,
    private service: ApiService,
    private router: ActivatedRoute,
    private route: Router
  ) {}
  items: string[] = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Qualified',
    'Final',
  ];
  results: string[] = ['Passed', 'Failed'];

  selectedOption: string = '';
  datas: any[] = [];
  rows: any[] = [];
  tbody: any[] = [];
  button: any[] = [];
  ExamResults: any[] = [];
  SchoolYear: string = '';
  Myanmar!: 0;
  English!: 0;
  Mathematics!: 0;
  Chemistry!: 0;
  Physics!: 0;
  Bio_Eco!: 0;
  totalMarks!: 0;
  id!: number;
  marks: any = {};
  student = this.router.snapshot.paramMap.get('id');

  showSuccessMessage = false;

  ngOnInit(): void {
    this.getMark();
  }
  // isValidNumber(num: number | undefined): boolean {
  //   return typeof num === 'number' && !isNaN(num);
  // }
  // SAVE
  async saveData() {
    // if (
    //   this.isValidNumber(this.Myanmar) &&
    //   this.isValidNumber(this.English) &&
    //   this.isValidNumber(this.Mathematics) &&
    //   this.isValidNumber(this.Chemistry) &&
    //   this.isValidNumber(this.Physics) &&
    //   this.isValidNumber(this.Bio_Eco)
    // ) {
    //   const totalMarks =
    //     this.Myanmar +
    //     this.English +
    //     this.Mathematics +
    //     this.Chemistry +
    //     this.Physics +
    //     this.Bio_Eco;

    //   console.log('Total Marks:', totalMarks);
    // } else {
    //   console.error('Invalid or missing marks for one or more subjects.');
    // }

    // const totalMarks =
    //   this.Myanmar +
    //   this.English +
    //   this.Mathematics +
    //   this.Chemistry +
    //   this.Physics +
    //   this.Bio_Eco;
    // console.log('Total Marks:', totalMarks);

    // const result = totalMarks >= 40 ? 'Passed' : 'Failed';

    var ExamResults = {
      SchoolYear: this.SchoolYear,
      Myanmar: this.Myanmar,
      English: this.English,
      Mathematics: this.Mathematics,
      Chemistry: this.Chemistry,
      Physics: this.Physics,
      Bio_Eco: this.Bio_Eco,
      Total: this.totalMarks,
      Result: this.results,
    };
    console.log(this.ExamResults);
    await this.service.examResultApiData(ExamResults).subscribe({
      next: (result: any) => {
        console.log('Student adds successfully!');

        // this.results.push(ExamResults);
        // form.resetForm();
        // asscending order
        // this.results.sort((a: any, b: any) => a.id - b.id);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },

      error: (error: any) => {
        console.log('FAIL', error);
        alert('Fail');
      },
    });
  }

  // FindAll
  async findAll() {
    console.log('>>>>>>ERROR>>>>');
    await this.service.findall(this.student).subscribe({
      next: (result: any) => {
        console.log('ADD SUCCESSFULLY!', result);
        console.log(result);
        this.rows = result.data;
        console.log(this.rows);
        // descending order
        // result.data.sort((a: any, b: any) => a.id - b.id);
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }
  // Table RS
  async getMark() {
    console.log('>>>>>>><<<<<<<<<<<<');
    await this.service.getMarks(this.student).subscribe({
      next: (result: any) => {
        console.log('ADD SUCCESSFULLY!', result);
        console.log(result);
        this.rows = result.data;
        this.student = result.student;
        console.log(this.student);
        console.log(this.rows);
        // descending order
        // result.data.sort((a: any, b: any) => a.id - b.id);
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }

  removeObjectById(array: any[], idToRemove: number): void {
    const indexToRemove: number = array.findIndex(
      (obj) => obj.id === idToRemove
    );
    if (indexToRemove !== -1) {
      array.splice(indexToRemove, 1);
    }
  }

  // Delete
  async deleteMark(id: any) {
    await this.service.deleteMarks(id).subscribe({
      next: (result: any) => {
        console.log('Deleted Sussessfully!');
        this.removeObjectById(this.rows, id);
      },
      error: (error: any) => {
        alert('FAIL!');
      },
    });
  }

  routeToStudent() {
    this.route.navigate(['/student']);
  }

  deleteRow(): void {
    // Remove the entire tbody
    const tbody = document.getElementById('tableBody');
    if (tbody) {
      tbody.remove();
    }
  }
  // getId(id: any) {
  //   return (this.id = id);
  // }
  plus() {
    this.rows.push({
      /* Initial data for a new tbody */
    });
  }
}
