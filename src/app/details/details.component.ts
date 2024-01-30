import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';
import { FormDataModel } from './detail';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  studentRoute: any;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private router: ActivatedRoute,
    private route: Router
  ) {}
  Student_id: any;
  // SchoolYear!: string;
  // Myanmar!: number;
  // English!: number;
  // Mathematics!: number;
  // Physics!: number;
  // Chemistry!: number;
  // Bio_Eco!: number;
  // totalMarks!: number;
  // result!: string;
  // Total!: number;
  // Result!: boolean;
  // id!: number;

  // array: any = [];

  items: string[] = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Qualified',
    'Final',
  ];
  // exams: string[] = ['Passed', 'Failed'];
  myResult!: string;

  selectedOption: string = '';
  datas: FormDataModel[] = [];
  rows: any = {};
  array: any = [];

  // myRows: any[] = [];
  myRows: any[] = [];

  // Student_id = this.router.snapshot.paramMap.get('id');

  showSuccessMessage = false;
  showErrorMessage = false;

  ngOnInit(): void {
    console.log('ngOnInit- Data:', this.datas);
    this.Student_id = this.service.getStudentId();
    if (this.Student_id != null) {
      this.getMark();
    }
    // this.loadFromLocalStorage();
    // this.initializeData();

    console.log('myRows:', this.myRows);
    console.log('datas:', this.datas);
    // this.route.navigate(['/details'], { replaceUrl: true });
  }

  trackByFn(index: number, item: FormDataModel): number {
    return item.id; // Assuming 'id' is a unique identifier in your FormDataModel
  }

  plus() {
    const newFormData: FormDataModel = new FormDataModel();
    this.datas.push(newFormData);
    console.log('Data after adding:', this.datas);
    // this.saveToLocalStorage();
  }
  // retrieveFromLocalStorage() {
  //   const value = this.saveToLocalStorage.getItem('myKey');
  //   console.log(value);
  // }
  // initializeData() {
  //   // If datas is empty (e.g., first visit or local storage was cleared), initialize it with a default value.
  //   if (this.datas.length === 0) {
  //     const defaultFormData: FormDataModel = new FormDataModel();
  //     this.datas.push(defaultFormData);
  //   }
  // }

  // loadFromLocalStorage() {
  //   const key = 'formdata';
  //   const storedData = localStorage.getItem(key);

  //   if (storedData) {
  //     this.datas = JSON.parse(storedData);
  //     console.log('Data loaded from local storage:', this.datas);
  //     // Update your page with the loaded data here
  //   } else {
  //     console.log('No data found in local storage');
  //   }
  // }
  // saveToLocalStorage() {
  //   // Convert the data to a JSON string before saving
  //   try {
  //     console.log('Data to be saved', this.datas);
  //     const key = 'formdata';
  //     localStorage.setItem(key, JSON.stringify(this.datas));
  //   } catch (error) {
  //     console.error('Error saving to local storage', error);
  //   }
  // }

  async saveData(form: any) {
    for (let data of this.datas) {
      const totalMarks =
        data.Myanmar +
        data.English +
        data.Mathematics +
        data.Chemistry +
        data.Physics +
        data.Bio_Eco;
      console.log('Total Marks:', totalMarks);

      const Result = totalMarks >= 40 ? 'Passed' : 'Failed';

      var myExamresults = {
        Student_id: this.Student_id,
        SchoolYear: data.SchoolYear,
        Myanmar: data.Myanmar,
        English: data.English,
        Mathematics: data.Mathematics,
        Physics: data.Physics,
        Chemistry: data.Chemistry,
        Bio_Eco: data.Bio_Eco,
        Total: totalMarks,
        Result: Result == 'Passed' ? true : false,
      };
      if (this.array.Student_id) {
        // If Student_id exists, it means we are in update mode
        await this.service
          .updateMarks(this.array.Student_id, myExamresults)
          .subscribe({
            next: (result: any) => {
              console.log('Updated Successfully!', result);
              this.getMark();
              this.showSuccessMessage = true;
            },
            error: (error: any) => {
              console.log('Update Failed!', error);
              alert('Update failed!');
            },
          });
      } else {
        // If Student_id doesn't exist, it means we are in save mode
        await this.service.examResultApiData(myExamresults).subscribe({
          next: (_result: any) => {
            console.log('Data added successfully!');
            data.totalMarks = totalMarks;
            data.result = Result;
            this.showSuccessMessage = true;
          },
          error: (error: any) => {
            console.log('Data add failed!', error);
            alert('Data add failed!');
          },
        });
      }

      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }

  // SAVE
  // async saveData(form: any) {
  //   for (let data of this.datas) {
  //     const totalMarks =
  //       data.Myanmar +
  //       data.English +
  //       data.Mathematics +
  //       data.Chemistry +
  //       data.Physics +
  //       data.Bio_Eco;
  //     console.log('Total Marks:', totalMarks);

  //     const Result = totalMarks >= 40 ? 'Passed' : 'Failed';
  //     var myExamresults = {
  //       Student_id: this.Student_id,
  //       SchoolYear: data.SchoolYear,
  //       Myanmar: data.Myanmar,
  //       English: data.English,
  //       Mathematics: data.Mathematics,
  //       Physics: data.Physics,
  //       Chemistry: data.Chemistry,
  //       Bio_Eco: data.Bio_Eco,
  //       Total: totalMarks,
  //       Result: Result == 'Passed' ? true : false,
  //     };

  //     console.log(myExamresults);
  //     await this.service.examResultApiData(myExamresults).subscribe({
  //       next: (result: any) => {
  //         console.log('Data add successfully!');
  //         data.totalMarks = totalMarks;
  //         data.result = Result;

  //         // this.results.push(ExamResults);
  //         // form.resetForm();
  //         // asscending order
  //         // this.results.sort((a: any, b: any) => a.id - b.id);

  //         this.showSuccessMessage = true;
  //         setTimeout(() => {
  //           this.showSuccessMessage = false;
  //         }, 3000);
  //       },

  //       error: (error: any) => {
  //         console.log('Data add fail!', error);
  //         alert('Data add fail!');
  //       },
  //     });
  //   }
  // }

  // FindAll
  async findAll() {
    console.log('>>>>>>ERROR>>>>');
    await this.service.findall().subscribe({
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
    await this.service.getMarks(this.Student_id).subscribe({
      next: (result: any) => {
        // console.log('ADD SUCCESSFULLY!', result);

        this.rows = result.data[0];

        this.myRows = result.data[0].exam_results.map((item: any) => ({
          ...item,
          Result: item.Result ? 'Passed' : 'Failed',
        }));
        console.log('>>>>>>>GetMark<<<<<<<<<<<<');
        // console.log(this.student);

        console.log(this.rows);
        console.log(this.myRows);
        // console.log('Rows as JSON:', JSON.stringify(this.rows));
        // this.myRows.forEach((items) => {
        //   items.Result = items.Result ? 'Passed' : 'Failed';
        // });
        // Add a null check before using forEach
        // this.saveToLocalStorage();
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
  async deleteMark(id: number) {
    console.log('>>>>>>>>>>>><<<<<<<<<<');
    await this.service.deleteMarks(id).subscribe({
      next: (result: any) => {
        console.log('Deleted Sussessfully!', result);
        this.removeObjectById(this.myRows, id);
      },
      error: (_error: any) => {
        alert('FAIL!');
      },
    });
  }

  // Update
  // async updateMark() {
  //   for (let data of this.datas) {
  //     const totalMarks =
  //       data.Myanmar +
  //       data.English +
  //       data.Mathematics +
  //       data.Chemistry +
  //       data.Physics +
  //       data.Bio_Eco;
  //     console.log('Total Marks:', totalMarks);

  //     const Result = totalMarks >= 40 ? 'Passed' : 'Failed';
  //     var updatedata = {
  //       Student_id: this.Student_id,
  //       SchoolYear: data.SchoolYear,
  //       Myanmar: data.Myanmar,
  //       English: data.English,
  //       Mathematics: data.Mathematics,
  //       Physics: data.Physics,
  //       Chemistry: data.Chemistry,
  //       Bio_Eco: data.Bio_Eco,
  //       Total: totalMarks,
  //       Result: Result == 'Passed' ? true : false,
  //     };
  //     await this.service
  //       .updateMarks(this.array.Student_id, updatedata)
  //       .subscribe({
  //         next: (result: any) => {
  //           console.log('Updated Successfully!', result);
  //           this.getMark();
  //         },
  //         error: (_error: any) => {
  //           alert('FAIL!');
  //         },
  //       });
  //   }
  // }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CRUD>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Export Excel
  // exportToExcel(data: any[], fileName: string): void {
  //   // Exclude unwanted columns (e.g., CreatedAt and UpdatedAt)
  //   const excludedColumns = ['createdAt', 'updatedAt'];
  //   const modifiedData = data.map((item) => {
  //     const newItem = { ...item };
  //     // if (newItem.gender !== undefined) {
  //     //   newItem.gender == newItem.gender ? 'Male' : 'Female';
  //     // }
  //     excludedColumns.forEach((column) => delete newItem[column]);
  //     return newItem;
  //   });
  //   // Convert modified data to Excel worksheet
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(modifiedData);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   // Save the workbook to an Excel file
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);
  // }
  exportToExcel(data: any[], fileName: string): void {
    // Define the columns you want to include in the export
    const includedColumns = [
      'Student_id',
      'Name',
      'Father_Name',
      'Date_of_Birth',
      'Gender',
      'Nrc_Exists',
      'Nrc',
      'SchoolYear',
      'Myanmar',
      'English',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Bio_Eco',
      'Total',
      'Result',
    ];

    // Create a new array with objects containing only the included columns
    const modifiedData = data.map((item) => {
      const newItem: any = {};
      includedColumns.forEach((column) => {
        newItem[column] = item[column];
      });
      return newItem;
    });

    // Remove 'createdAt' and 'updatedAt' properties from each object in the array
    const dataWithoutTimestamps = modifiedData.map((item) => {
      delete item.createdAt;
      delete item.updatedAt;
      return item;
    });

    // Convert modified data to Excel worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutTimestamps);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook to an Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  // Delete all
  async deleteAllById() {
    const studentIdToDelete = this.rows?.Student_id;

    if (!studentIdToDelete) {
      console.error('Student ID is missing.');
      return;
    }
    await this.service.deleteAllByStudentId(studentIdToDelete).subscribe({
      next: (_result: any) => {
        console.log('Deleted Sussessfully!');
      },
      error: (_error: any) => {
        alert('FAIL!');
      },
    });
  }

  // Import from Excel
  importFromExcel(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const binaryString: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(binaryString, {
          type: 'binary',
        });
        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const importedData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          raw: true,
        });

        for (const row of importedData) {
          const idSet = new Set();

          if (typeof row.Result !== 'boolean' || row.Result == null) {
            console.error(
              'Invalid result in Excel data. Result must be "Passed" or "Failed".'
            );
            this.showErrorMessage = true;
            setTimeout(() => {
              this.showErrorMessage = false;
            }, 3000);
            event.target.value = null;
            return; // Exit function if gender is invalid
          }
        }

        console.log(importedData);

        this.service.bulkcreate(importedData).subscribe({
          next: (result: any) => {
            console.log('Excel datas saved successfully', result);
            this.getMark();
            this.showErrorMessage = true;
            setTimeout(() => {
              this.showErrorMessage = false;
            }, 3000);
            event.target.value = null;
          },
          error: (error: any) => {
            console.log('Error Saving datas form Excel', error);
            alert('Excel import failed. Please try again.');
          },
        });
      };
      reader.readAsBinaryString(file);
    }
  }

  new_data(form: any) {
    form.resetForm();
    this.myRows = [];
    // Enable the form fields by removing the 'disabled' attribute
    const formControls = [
      'id',
      'name',
      'father_name',
      'datepicker',
      'Gender',
      'Nrc_Exists',
      'nrc',
    ];
    formControls.forEach((control) => {
      const element = document.getElementById(control) as HTMLInputElement;
      if (element) {
        element.removeAttribute('disabled');
      }
    });
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Validation for Myanmar
  validateMaxValue(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value > 100 ? { maxValue: true } : null;
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
}
