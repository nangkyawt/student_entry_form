import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

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

  SchoolYear!: string;
  Myanmar!: number;
  English!: number;
  Mathematics!: number;
  Physics!: number;
  Chemistry!: number;
  Bio_Eco!: number;
  totalMarks!: number;
  result!: string;
  items: string[] = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Qualified',
    'Final',
  ];
  exams: string[] = ['Passed', 'Failed'];
  myResult!: string;

  selectedOption: string = '';
  datas: any[] = [];
  rows: any[] = [];
  tbody: any[] = [];
  button: any[] = [];
  myRows: any[] = [];

  student_id = this.router.snapshot.paramMap.get('id');

  showSuccessMessage = false;

  ngOnInit(): void {
    this.getMark();
  }

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

    var myExamresults = {
      id: this.student_id,
      SchoolYear: this.SchoolYear,
      Myanmar: this.Myanmar,
      English: this.English,
      Mathematics: this.Mathematics,
      Physics: this.Physics,
      Chemistry: this.Chemistry,
      Bio_Eco: this.Bio_Eco,
      Total: this.totalMarks,
      Result: this.result == 'Passed' ? true : false,
    };
    console.log(myExamresults);
    await this.service.examResultApiData(myExamresults).subscribe({
      next: (result: any) => {
        console.log('Data add successfully!');

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
        console.log('Data add fail!', error);
        alert('Data add fail!');
      },
    });
  }

  // FindAll
  async findAll() {
    console.log('>>>>>>ERROR>>>>');
    await this.service.findall(this.student_id).subscribe({
      next: (result: any) => {
        console.log('ADD SUCCESSFULLY!', result);

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
    console.log('>>>>>>>GetMark<<<<<<<<<<<<');
    await this.service.getMarks(this.student_id).subscribe({
      next: (result: any) => {
        // console.log('ADD SUCCESSFULLY!', result);

        this.rows = result.data;
        this.myRows = result.data[0].Result;

        // console.log(this.student);
        console.log(this.rows);
        this.myRows.forEach((items) => {
          items.Result = items.Result ? 'Passed' : 'Failed';
        });

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
    console.log('>>>>>>>>>>>><<<<<<<<<<');
    await this.service.deleteMarks(id).subscribe({
      next: (result: any) => {
        console.log('Deleted Sussessfully!');
        this.removeObjectById(this.myRows, id);
      },
      error: (error: any) => {
        alert('FAIL!');
      },
    });
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CRUD>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Export Excel
  exportToExcel(data: any[], fileName: string): void {
    // Exclude unwanted columns (e.g., CreatedAt and UpdatedAt)
    const excludedColumns = ['createdAt', 'updatedAt'];
    const modifiedData = data.map((item) => {
      const newItem = { ...item };
      // if (newItem.gender !== undefined) {
      //   newItem.gender == newItem.gender ? 'Male' : 'Female';
      // }
      excludedColumns.forEach((column) => delete newItem[column]);
      return newItem;
    });
    // Convert modified data to Excel worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // Save the workbook to an Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
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

  plus() {
    this.datas.push({
      /* Initial data for a new tbody */
    });
  }
}
