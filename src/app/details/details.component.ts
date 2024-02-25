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
  newStudent_id: any;
  items: string[] = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Qualified',
    'Final',
  ];
  myResult!: string;
  selectedOption: string = '';
  datas: FormDataModel[] = [];
  rows: any = {};
  array: any = [];
  isNew: boolean = false;
  disableExportButton: boolean = false;
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
  showDeleteMessage = false;
  showNameErrorMessage = false;

  ngOnInit(): void {
    console.log('ngOnInit- Data:', this.datas);
    // this.myStudentId = this.service.getStudentId();
    this.Student_id = this.service.getStudentId();
    console.log(this.Student_id, '>>>>>>>>>>>>>');
    if (this.Student_id !== null) {
      this.getMark();
      console.log(this.Student_id);
    } else {
      console.error('Student_id is null . Cannot proceed with operations.');
    }

    console.log('myRows:', this.myRows);
    console.log('datas:', this.datas);
  }

  trackByFn(index: number, item: FormDataModel): number {
    return item.id;
  }

  plus() {
    const newFormData: FormDataModel = new FormDataModel();

    this.datas.push(newFormData);
    console.log('Data after adding:', this.datas);

    // this.saveToLocalStorage();
  }

  // Save
  async saveData(form: any) {
    try {
      if (!this.Student_id) {
        await this.createBoth();
      } else {
        await this.createBulk();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred!');
    }
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

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

  //Old createbulk
  async createBulk() {
    for (let data of this.datas) {
      if (
        data.SchoolYear == null ||
        data.Myanmar == null ||
        data.English == null ||
        data.Mathematics == null ||
        data.Physics == null ||
        data.Chemistry == null ||
        data.Bio_Eco == null
      ) {
        alert('Cannot be empty. Please check the input.');
        return; // Exit the function if any subject's marks are above 100
      }
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
          alert('Add Successfully');
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
    console.log('Data before sending:', this.rows);
    if (
      !this.rows.Student_id ||
      !this.rows.Name ||
      !this.rows.Father_Name ||
      !this.rows.Date_of_Birth ||
      typeof this.rows.Gender == 'undefined' ||
      typeof this.rows.Nrc_Exists == 'undefined' ||
      !this.rows.Nrc
    ) {
      // Prepare the error messages
      const errorMessages = [];

      if (!this.rows.Student_id) {
        errorMessages.push('Student ID is required.');
      }
      if (!this.rows.Name) {
        errorMessages.push("Student's Name is required.");
      }
      if (!this.rows.Father_Name) {
        errorMessages.push("Father's Name is required.");
      }
      if (!this.rows.Date_of_Birth) {
        errorMessages.push('Date of Birth is required.');
      }
      if (typeof this.rows.Gender === 'undefined') {
        errorMessages.push('Gender is required.');
      }

      if (this.rows.Nrc_Exists && !this.rows.Nrc) {
        errorMessages.push('NRC is required.');
      }

      // if (!this.datas || this.datas.length === 0) {
      //   errorMessages.push('At least one exam result is required.');
      // }
      console.log(this.rows);
      console.log(errorMessages);
      // Send response with error messages
      return alert('Required fields are missing:\n' + errorMessages.join('\n'));
    }
    this.service.studentsApiData(this.rows).subscribe({
      next: (result: any) => {
        console.log('Add Succesfully', result);
        this.Student_id = this.rows.Student_id;
        alert('Add Successfully');
        this.rows = [];
      },
    });

    // If student does not exist, proceed with creating both
    const newCreateData = {
      Student_id: this.rows.Student_id,
      Name: this.rows.Name,
      Father_Name: this.rows.Father_Name,
      Date_of_Birth: this.rows.Date_of_Birth,
      Gender: this.rows.Gender,
      Nrc_Exists: this.rows.Nrc_Exists ? 'Yes' : 'No',
      Nrc: this.rows.Nrc,
      examResults: this.datas.map((item) => ({
        ...item,
        Student_id: this.rows.Student_id,
      })),
    };
    console.log('Data to be sent:', newCreateData);

    // Call service to create
    this.service.createBoth(newCreateData).subscribe({
      next: (result: any) => {
        console.log('ADD SUCCESSFULLY!', result);
        this.Student_id = this.rows.Student_id;
        alert('Add Successfully!');
      },
      error: (error: any) => {
        console.log('FAIL', error.message);
      },
    });
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
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
  deleteMark(id: any): void {
    console.log('>>>>>>>>>>>><<<<<<<<<<');
    this.service.deleteMark(id).subscribe({
      next: (result: any) => {
        console.log('Deleted Sussessfully!', result);
        this.removeObjectById(this.myRows, id);
      },
      error: (_error: any) => {
        alert('FAIL!');
      },
    });
    setTimeout(() => {
      this.showDeleteMessage = false;
    }, 3000);
  }

  // Update
  async updateMark() {
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
      var updatedata = {
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
      await this.service.updateMarks(this.Student_id, updatedata).subscribe({
        next: (result: any) => {
          console.log('Updated Successfully!', result);
          this.getMark();
        },
        error: (_error: any) => {
          alert('FAIL!');
        },
      });
    }
  }

  // Delete all
  async deleteAllById() {
    await this.service.deleteAllByStudentId(this.Student_id).subscribe({
      next: (_result: any) => {
        console.log('Deleted Sussessfully!');
        alert('Delete Successfully!!');
        this.route.navigate(['/student']);
      },
      error: (_error: any) => {
        alert('FAIL!');
      },
    });
  }

  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<CRUD>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  // Export
  exportToExcel(rows: any, fileName: string): void {
    // Define the columns you want to include in the export
    const includedColumns = [
      'Student_id',
      'Name',
      'Father_Name',
      'Date_of_Birth',
      'Nrc_Exists',
      'Nrc',
      'Gender',
      'SchoolYear',
      'Myanmar',
      'English',
      'Mathematics',
      'Chemistry',
      'Physics',
      'Bio_Eco',
      'Total',
      'Result',
    ];

    // Initialize an array to hold the final data
    const finalData: any[] = [];

    // Loop through each property (student) of the rows object
    for (const studentId in rows) {
      if (rows.hasOwnProperty(studentId)) {
        const student = rows[studentId];
        // Check if student data has exam results
        if (student.exam_results && student.exam_results.length > 0) {
          console.log(student.exam_results, 'examResults');
          // Loop through each exam result of the student
          student.exam_results.forEach((result: any) => {
            // Create a new row for each examresult
            const newRow: any = {};

            // Copy student information to the new row
            includedColumns.forEach((column) => {
              newRow[column] = student[column];
              newRow['Gender'] = student['Gender'] ? 'Male' : 'Female';
              newRow['Result'] = student['Result'] ? 'Passed' : 'Failed';
            });

            // Copy exam result information to the new row
            includedColumns.slice(7, 16).forEach((column) => {
              // newRow[column] =
              //   result[column.substring(column.indexOf('_') + 1)];
              newRow[column] = result[column];
            });

            // Add the new row to the final data
            finalData.push(newRow);
            console.log(finalData);
            console.log(newRow);
          });
        } else {
          // If student has no exam results, create a row with only student information
          const newRow: any = {};
          includedColumns.forEach((column) => {
            newRow[column] = student[column];
          });
          finalData.push(newRow);
        }
      }
    }

    // Convert modified data to Excel worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(finalData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook to an Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  // Import from Excel
  // importFromExcel(event: any): void {
  //   const file: File = event.target.files[0];
  //   const reader: FileReader = new FileReader();

  //   if (file) {
  //     reader.onload = (e: any) => {
  //       try {
  //         const arrayBuffer: ArrayBuffer = e.target.result;
  //         const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, {
  //           type: 'array',
  //         });
  //         const sheetName: string = workbook.SheetNames[0];
  //         const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  //         const importedData: any[] = XLSX.utils.sheet_to_json(worksheet, {
  //           raw: true,
  //         });

  //         const transformedData = importedData.map((studentData: any) => {
  //           console.log(studentData, 'Here is studentData');
  //           const transformedStudent = {
  //             Student_id: studentData.Student_id,
  //             Name: studentData.Name,
  //             Father_Name: studentData.Father_Name,
  //             Date_of_Birth: studentData.Date_of_Birth,
  //             Gender: studentData.Gender === 'Female' ? true : false,
  //             Nrc_Exists: studentData.Nrc_Exists,
  //             Nrc: studentData.Nrc,
  //             examResults: [
  //               {
  //                 SchoolYear: studentData.SchoolYear,
  //                 Myanmar: studentData.Myanmar,
  //                 English: studentData.English,
  //                 Mathematics: studentData.Mathematics,
  //                 Physics: studentData.Physics,
  //                 Chemistry: studentData.Chemistry,
  //                 Bio_Eco: studentData.Bio_Eco,
  //                 Total: studentData.totalMarks,
  //               },
  //             ],
  //           };
  //           console.log(transformedStudent);
  //           return transformedStudent;
  //         });

  //         // Call service to save the transformed data
  //         this.service.excelImport(transformedData).subscribe({
  //           next: (result: any) => {
  //             console.log('Excel data saved successfully', result);
  //             alert('Excel data imported successfully.');
  //           },
  //           error: (error: any) => {
  //             console.log('Error saving Excel data', error);
  //             alert('Error importing Excel data. Please try again.');
  //           },
  //         });
  //       } catch (error) {
  //         console.error('Error importing Excel data:', error);
  //         alert(
  //           'Error importing Excel data. Please ensure the file format is correct and try again.'
  //         );
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // }

  importFromExcel(event: any): void {
    const file: File = event.target.files[0];
    const reader: FileReader = new FileReader();

    if (file) {
      reader.onload = (e: any) => {
        try {
          const arrayBuffer: ArrayBuffer = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(arrayBuffer, {
            type: 'array',
          });
          const sheetName: string = workbook.SheetNames[0];
          const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
          const importedData: any[] = XLSX.utils.sheet_to_json(worksheet, {
            raw: true,
          });

          console.log(importedData, 'Here is my importedData');
          for (const data of importedData) {
            // const idSet = new Set();
            if (typeof data.name !== 'string' || data.name == null) {
              console.error('Ivalid name.');
              this.showNameErrorMessage = true;
              setTimeout(() => {
                this.showNameErrorMessage = false;
              }, 3000);
              event.target.value = null;
              return;
            }
            // if (typeof row.name !== 'string' || row.name == null) {
            //   console.error('Ivalid name.');
            //   this.showNameErrorMessage = true;
            //   setTimeout(() => {
            //     this.showNameErrorMessage = false;
            //   }, 3000);
            //   event.target.value = null;
            //   return;
            // }
            // if (typeof row.nrc_exists !== 'boolean' || row.nrc_exists == null) {
            //   console.error('Invalid NRC.');
            //   this.showNRCExistsErrorMessage = true;
            //   setTimeout(() => {
            //     this.showNRCExistsErrorMessage = false;
            //   }, 3000);
            //   event.target.value = null;
            //   return;
            // }
          }
          // Transform data
          const transformedData = importedData.map((studentData: any) => {
            console.log(studentData, 'Here is studentData');
            const transformedStudent = {
              Student_id: studentData.Student_id,
              Name: studentData.Name,
              Father_Name: studentData.Father_Name,
              Date_of_Birth: studentData.Date_of_Birth,
              Gender: studentData.Gender === 'Female' ? true : false,
              Nrc_Exists: studentData.Nrc_Exists,
              Nrc: studentData.Nrc,
              examResults: [
                {
                  SchoolYear: studentData.SchoolYear,
                  Myanmar: studentData.Myanmar,
                  English: studentData.English,
                  Mathematics: studentData.Mathematics,
                  Physics: studentData.Physics,
                  Chemistry: studentData.Chemistry,
                  Bio_Eco: studentData.Bio_Eco,
                  totalMarks:
                    studentData.Myanmar +
                    studentData.English +
                    studentData.Mathematics +
                    studentData.Physics +
                    studentData.Chemistry +
                    studentData.Bio_Eco,
                },
              ],
            };
            console.log(transformedStudent);
            return transformedStudent;
          });

          // Call service to delete existing data and save the transformed data
          this.service.deleteMarksById(this.Student_id).subscribe({
            next: () => {
              console.log('Existing exam results deleted successfully');
              // Call service to save the transformed data
              this.service.excelImport(transformedData).subscribe({
                next: (result: any) => {
                  console.log('Excel data saved successfully', result);
                  alert('Excel data imported successfully.');
                },
                error: (error: any) => {
                  console.log('Error saving Excel data', error);
                  alert('Error importing Excel data. Please try again.');
                },
              });
            },
            error: (error: any) => {
              console.log('Error deleting existing exam results', error);
              alert('Error importing Excel data. Please try again.');
            },
          });
        } catch (error) {
          console.error('Error importing Excel data:', error);
          alert(
            'Error importing Excel data. Please ensure the file format is correct and try again.'
          );
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  uploadExcelData(binaryData: string) {
    // Change the API endpoint to your backend server
    return (
      this.service.excelImport,
      {
        binaryData,
      }
    );
  }

  new_data(form: any) {
    this.Student_id = null;
    this.rows = {};
    this.isNew = true;

    form.resetForm();
    this.disableExportButton = true;
    console.log(this.rows);
    this.myRows = [];
    this.datas = [];

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

  valiAge(): boolean {
    if (!this.students.Date_of_Birth) {
      return false;
    }
    const birthDate = new Date(this.students.Date_of_Birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    return age < 18;
  }

  deleteRow(index: number): void {
    // Remove the entire tbody
    const tbody = document.getElementById('tableBody');

    this.datas.splice(index, 1);
  }

  updateCaculation() {
    for (let data of this.datas) {
      data.result =
        data.Myanmar >= 40 &&
        data.English >= 40 &&
        data.Mathematics >= 40 &&
        data.Chemistry >= 40 &&
        data.Physics >= 40 &&
        data.Bio_Eco >= 40
          ? 'Passed'
          : 'Failed';

      data.totalMarks =
        data.Myanmar +
        data.English +
        data.Mathematics +
        data.Chemistry +
        data.Physics +
        data.Bio_Eco;
    }
  }

  limitToThreeDigits(event: any) {
    const inputValue = event.target.value;
    if (inputValue.length > 3) {
      event.target.value = inputValue.slice(0, 3);
    }
  }
}
