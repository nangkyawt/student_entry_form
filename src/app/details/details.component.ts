import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

import { FormDataModel } from './detail';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements OnInit {
  // formData: FormDataModel = new FormDataModel();
  @ViewChild('fileInput') fileInput!: ElementRef;

  studentRoute: any;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private router: ActivatedRoute,
    private route: Router
  ) {}
  Student_id: any;
  // myStudentId: any;
  newStudent_id: any;

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
  isNew: boolean = false;

  // myRows: any[] = [];
  myRows: any[] = [];

  // Student_id = this.router.snapshot.paramMap.get('id');
  students = {
    Student_id: 0,
    Name: '',
    Father_Name: '',
    Date_of_Birth: '',
    Gender: true,
    Nrc_Exists: false,
    Nrc: '',
  };
  showSuccessMessage = false;
  showErrorMessage = false;
  showGenderErrorMessage = false;
  showMarkErrorMessage = false;

  ngOnInit(): void {
    console.log('ngOnInit- Data:', this.datas);
    // this.myStudentId = this.service.getStudentId();
    this.Student_id = this.service.getStudentId();
    if (this.Student_id !== null) {
      this.getMark();
      console.log(this.Student_id);
    } else {
      console.error('Student_id is null . Cannot proceed with operations.');
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
  //     if (this.array.Student_id) {
  //       // If Student_id exists, it means we are in update mode
  //       await this.service
  //         .updateMarks(this.array.Student_id, myExamresults)
  //         .subscribe({
  //           next: (result: any) => {
  //             console.log('Updated Successfully!', result);
  //             this.getMark();
  //             this.showSuccessMessage = true;
  //           },
  //           error: (error: any) => {
  //             console.log('Update Failed!', error);
  //             alert('Update failed!');
  //           },
  //         });
  //     } else {
  //       // If Student_id doesn't exist, it means we are in save mode
  //       await this.service.examResultApiData(myExamresults).subscribe({
  //         next: (_result: any) => {
  //           console.log('Data added successfully!');
  //           data.totalMarks = totalMarks;
  //           data.result = Result;
  //           this.showSuccessMessage = true;
  //         },
  //         error: (error: any) => {
  //           console.log('Data add failed!', error);
  //           alert('Data add failed!');
  //         },
  //       });
  //     }

  //     setTimeout(() => {
  //       this.showSuccessMessage = false;
  //     }, 3000);
  //   }

  // }
  // async saveData(form: any) {
  //   for (let data of this.datas) {
  //     if (
  //       data.Myanmar > 100 ||
  //       data.English > 100 ||
  //       data.Mathematics > 100 ||
  //       data.Physics > 100 ||
  //       data.Chemistry > 100 ||
  //       data.Bio_Eco > 100
  //     ) {
  //       alert(
  //         'Marks for each subject cannot be above 100. Please check the input.'
  //       );
  //       return; // Exit the function if any subject's marks are above 100
  //     }

  //     data.totalMarks =
  //       data.Myanmar +
  //       data.English +
  //       data.Mathematics +
  //       data.Chemistry +
  //       data.Physics +
  //       data.Bio_Eco;

  //     // Validate user input before creating myExamresults
  //     const Result =
  //       data.Myanmar >= 40 &&
  //       data.English >= 40 &&
  //       data.Mathematics >= 40 &&
  //       data.Chemistry >= 40 &&
  //       data.Physics >= 40 &&
  //       data.Bio_Eco >= 40
  //         ? 'Passed'
  //         : 'Failed';

  //     // Continue with saving only if validation passes
  //     const myExamresults = {
  //       Student_id: this.Student_id,
  //       SchoolYear: data.SchoolYear,
  //       Myanmar: data.Myanmar,
  //       English: data.English,
  //       Mathematics: data.Mathematics,
  //       Physics: data.Physics,
  //       Chemistry: data.Chemistry,
  //       Bio_Eco: data.Bio_Eco,
  //       Total: data.totalMarks,
  //       Result: Result == 'Passed' ? true : false,
  //     };

  //     const newStudent = {
  //       // Provide the necessary properties for creating a new student
  //       Student_id: this.Student_id,
  //       Name: this.rows.Name,
  //       Father_Name: this.rows.Father_Name,
  //       Date_of_Birth: this.rows.Date_of_Birth,
  //       Gender: this.rows.Gender,
  //       Nrc_Exists: this.rows.Nrc_Exists,
  //       Nrc: this.rows.Nrc,
  //     };

  //     try {
  //       await this.service.createBoth(myExamresults).subscribe({
  //         next: (_result: any) => {
  //           console.log('Data added successfully!');
  //           console.log(Result);
  //           console.log(this.Student_id);
  //           data.totalMarks = data.totalMarks;
  //           data.result = Result;
  //           this.showSuccessMessage = true;
  //         },
  //         error: (error: any) => {
  //           console.log('Data add failed!', error);
  //           alert('Data add failed!');
  //         },
  //       });
  //     } catch (error) {
  //       console.error('Error:', error);
  //       alert('Error occurred!');
  //     }

  //     setTimeout(() => {
  //       this.showSuccessMessage = false;
  //     }, 3000);
  //   }
  // }

  async saveData(form: any) {
    // try {
    //   if (!this.Student_id) {
    //     await this.createBoth();
    //   } else {
    //     await this.createBulk();
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('Error occurred!');
    // }
    // try {
    //   if (this.Student_id) {
    //     await this.createBulk();
    //   }
    // } catch (error) {
    //   console.error('Error:', error);
    //   alert('Error occurred!');
    // }
    // setTimeout(() => {
    //   this.showSuccessMessage = false;
    // }, 3000);
  }

  // generateStudentId(): string {
  //   // Implement your logic to generate a new student ID
  //   // This could be based on a timestamp, random string, or any other method
  //   return this.; // Replace with your actual generation logic
  // }

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

  // async getMark() {
  //   // Add a check for null before making the API call
  //   if (this.Student_id !== null) {
  //     await this.service.getMarks(this.Student_id).subscribe({
  //       next: (result: any) => {
  //         this.rows = result.data[0];

  //         this.myRows = result.data[0].exam_results.map((item: any) => ({
  //           ...item,
  //           Result: item.Result ? 'Passed' : 'Failed',
  //         }));
  //         console.log('>>>>>>>GetMark<<<<<<<<<<<<');
  //         console.log(this.rows);
  //         console.log(this.myRows);
  //       },
  //       error: (error: any) => {
  //         console.log('FAIL', error);
  //       },
  //     });
  //   } else {
  //     // Handle the case where Student_id is null
  //     console.log('Student_id is null. Cannot fetch marks.');
  //     // You may want to reset or initialize relevant data here
  //     this.rows = {};
  //     this.myRows = [];
  //   }
  // }

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
  // exportToExcel(data: any[], fileName: string): void {
  //   // Define the columns you want to include in the export
  //   console.log('Original Data:', data);
  //   console.log('Other data:', this.rows);
  //   const otherColumns = [      'Name',
  //   'Father_Name',
  //   'Date_of_Birth',
  //   'Gender',
  //   'Nrc_Exists',
  //   'Nrc',]
  //   const includedColumns = [
  //     'Student_id',

  //     'SchoolYear',
  //     'Myanmar',
  //     'English',
  //     'Mathematics',
  //     'Physics',
  //     'Chemistry',
  //     'Bio_Eco',
  //     'Total',
  //     'Result',
  //   ];

  //   const otherData = this.rows.map((item) => {
  //     const newItem: any = {};
  //     otherColumns.forEach((column) => {
  //       newItem[column] = item[column];
  //     });
  //     return newItem;
  //   });

  //   // Create a new array with objects containing only the included columns
  //   const modifiedData = data.map((item) => {
  //     const newItem: any = {};
  //     includedColumns.forEach((column) => {
  //       newItem[column] = item[column];
  //     });
  //     return newItem;
  //   });

  //   // Remove 'createdAt' and 'updatedAt' properties from each object in the array
  //   const dataWithoutTimestamps = modifiedData.map((item) => {
  //     delete item.createdAt;
  //     delete item.updatedAt;
  //     return item;
  //   });

  //   // Convert modified data to Excel worksheet
  //   const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataWithoutTimestamps);
  //   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //   // Save the workbook to an Excel file
  //   XLSX.writeFile(wb, `${fileName}.xlsx`);

  // }

  exportToExcel(data: any[], fileName: string): void {
    // Define the columns you want to include in the export
    const includedColumns = [
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
    // Check if this.rows is an object
    if (typeof this.rows !== 'object' || this.rows === null) {
      console.error('this.rows is not an object');
      return;
    }
    const otherColumns = [
      'Student_id',
      'Name',
      'Father_Name',
      'Date_of_Birth',
      'Gender',
      'Nrc_Exists',
      'Nrc',
    ];
    // Extract data for other columns from this.rows
    const otherData = [this.rows].map((item) => {
      const newItem: any = {};
      otherColumns.forEach((column) => {
        newItem[column] = item[column];
        // Convert boolean gender to string "Male" or "Female"
        newItem['Gender'] = item['Gender'] ? 'Male' : 'Female';
      });
      return newItem;
    });

    // Combine data from otherColumns and includedColumns
    const finalData = modifiedData.map((item, index) => ({
      ...otherData[index],
      ...item,
    }));

    // Convert modified data to Excel worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);
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

        for (this.myRows of importedData) {
          const idSet = new Set();
          console.log(importedData);
          console.log(this.myRows);
          if (
            typeof importedData !== 'number' ||
            importedData < 0 ||
            importedData > 100
          ) {
            console.error(
              'Invalid mark in Excel data. Mark must be a number between 0 and 100.'
            );
            this.showMarkErrorMessage = true;
            setTimeout(() => {
              this.showMarkErrorMessage = false;
            }, 3000);
            event.target.value = null;
            return;
          }
          if (typeof data.result !== 'boolean' || data.result == null) {
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
        console.log(this.rows);
        if (typeof this.rows.gender !== 'boolean' || this.rows.gender == null) {
          // Convert the gender value to a string (if it's not already)
          // const genderString = String(row.gender).trim().toLowerCase();
          // console.log(genderString);
          // if (genderString === 'male' || genderString === 'female') {
          //   row.gender = genderString === 'female';
          // } else {
          // Show error message for invalid gender
          console.error(
            'Invalid gender in Excel data. Gender must be "male" or "female".'
          );
          this.showGenderErrorMessage = true;
          setTimeout(() => {
            this.showGenderErrorMessage = false;
          }, 3000);
          event.target.value = null;
          return; // Exit function if gender is invalid
        }

        console.log(importedData);

        // this.service.bulkcreate(importedData).subscribe({
        //   next: (result: any) => {
        //     console.log('Excel datas saved successfully', result);
        //     this.getMark();
        //     this.showErrorMessage = true;
        //     setTimeout(() => {
        //       this.showErrorMessage = false;
        //     }, 3000);
        //     event.target.value = null;
        //   },
        //   error: (error: any) => {
        //     console.log('Error Saving datas form Excel', error);
        //     alert('Excel import failed. Please try again.');
        //   },
        // });
      };
      reader.readAsBinaryString(file);
    }
  }

  new_data(form: any) {
    this.Student_id = null;
    this.rows = {};
    this.isNew = true;

    form.resetForm();

    console.log(this.rows);
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

  // Validation for Each Subject
  validateMaxValue(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return value > 100 ? { maxValue: true } : null;
  }

  routeToStudent() {
    this.route.navigate(['/student']);
  }

  deleteRow(index: number): void {
    // Remove the entire tbody
    const tbody = document.getElementById('tableBody');
    // if (tbody) {
    //   tbody.remove();
    //   this.datas.splice(index, 1);
    // }
    if (confirm('Are you sure you want to delete this row?')) {
      // Remove the row at the specified index from the datas array
      this.datas.splice(index, 1);

      // Optionally, you can update any relevant data or trigger other actions here
    }
  }

  //Old createbulk
  async createBulk() {
    for (let data of this.datas) {
      if (
        data.Myanmar > 100 ||
        data.English > 100 ||
        data.Mathematics > 100 ||
        data.Physics > 100 ||
        data.Chemistry > 100 ||
        data.Bio_Eco > 100
      ) {
        alert(
          'Marks for each subject cannot be above 100. Please check the input.'
        );
        return; // Exit the function if any subject's marks are above 100
      }
      data.totalMarks =
        data.Myanmar +
        data.English +
        data.Mathematics +
        data.Chemistry +
        data.Physics +
        data.Bio_Eco;

      const Result =
        data.Myanmar >= 40 &&
        data.English >= 40 &&
        data.Mathematics >= 40 &&
        data.Chemistry >= 40 &&
        data.Physics >= 40 &&
        data.Bio_Eco >= 40
          ? 'Passed'
          : 'Failed';

      const myExamresults = [
        {
          Student_id: this.Student_id,
          SchoolYear: data.SchoolYear,
          Myanmar: data.Myanmar,
          English: data.English,
          Mathematics: data.Mathematics,
          Physics: data.Physics,
          Chemistry: data.Chemistry,
          Bio_Eco: data.Bio_Eco,
          Total: data.totalMarks,
          Result: Result == 'Passed' ? true : false,
        },
      ];
      console.log('>>>>>>ERROR>>>>');
      console.log(this.Student_id, '>>>>>>>>>>');
      console.log(myExamresults);
      await this.service.bulkcreate(myExamresults).subscribe({
        next: (result: any) => {
          console.log(myExamresults);
          console.log('ADD SUCCESSFULLY!', result);
          data.Total = data.totalMarks;
          data.result = Result;
          console.log(Result);
          console.log(data.totalMarks);
          this.showSuccessMessage = true;
          // const addedData = result.data[0];
          // this.datas[this.datas.length - 1] = addedData;
          // const newFormData = new FormDataModel();
          // this.datas.push(newFormData);
        },
        error: (error: any) => {
          console.log('FAIL', error);
        },
      });
      setTimeout(() => {
        this.showSuccessMessage = false;
      }, 3000);
    }
  }

  async createBoth() {
    const newCreateData = {
      Student_id: this.rows.Student_id,
      Name: this.rows.Name,
      Father_Name: this.rows.Father_Name,
      Date_of_Birth: this.rows.Date_of_Birth,
      Gender: this.rows.Gender,
      Nrc_Exists: this.rows.Nrc_Exists,
      Nrc: this.rows.Nrc,
      examResults: this.datas.map((item) => ({
        ...item,
        Student_id: this.Student_id,
      })),
    };
    console.log('New Create Data');
    console.log(this.Student_id, '>>>>>>>>>>');
    await this.service.createBoth(newCreateData).subscribe({
      next: (result: any) => {
        console.log('ADD SUCCESSFULLY!', result);
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}
