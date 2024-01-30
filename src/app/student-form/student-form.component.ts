import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { throttle } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private http: HttpClient,
    private service: ApiService,
    private route: Router
  ) {}
  pageSize: any = 10;
  currentPage = 1;
  searchText: any;
  data: any;
  results: any = [];
  array: any = [];
  excel_data: any = [];
  shouldnavigate = true;
  showSuccessMessage = false;
  showErrorMessage = false;
  showGenderErrorMessage = false;
  showNRCExistsErrorMessage = false;
  showIdErrorMessage = false;
  showNameErrorMessage = false;
  students = {
    Student_id: 0,
    Name: '',
    Father_Name: '',
    Date_of_Birth: '',
    Gender: true,
    Nrc_Exists: false,
    Nrc: '',
  };
  ngOnInit(): void {
    this.getstudent();
  }

  // radio button
  gendermale() {
    this.students.Gender = false;
  }
  genderfemale() {
    this.students.Gender = true;
  }
  // Export to Excel
  exportToExcel(data: any[], fileName: string): void {
    // Exclude unwanted columns (e.g., CreatedAt and UpdatedAt)
    const excludedColumns = ['createdAt', 'updatedAt'];
    const modifiedData = data.map((item) => {
      const newItem = { ...item };
      if (newItem.Gender !== undefined) {
        newItem.Gender == newItem.Gender ? 'Male' : 'Female';
      }
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

          // Check if gender property exists and is not null
          // if (isNaN(row.id) || idSet.has(row.id)) {
          //         return false;
          //       } else {
          //         console.error(
          //           'Invalid or duplicate id . Must be a unique number or order ID cannot be null'
          //         );
          //         this.showIdErrorMessage = true;
          //         setTimeout(() => {
          //           this.showIdErrorMessage = false;
          //         }, 3000);
          //       }idSet.add(row.id);

          if (typeof row.gender !== 'boolean' || row.gender == null) {
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
          if (typeof row.name !== 'string' || row.name == null) {
            console.error('Ivalid name.');
            this.showNameErrorMessage = true;
            setTimeout(() => {
              this.showNameErrorMessage = false;
            }, 3000);
            event.target.value = null;
            return;
          }
          if (typeof row.nrc_exists !== 'boolean' || row.nrc_exists == null) {
            console.error('Invalid NRC.');
            this.showNRCExistsErrorMessage = true;
            setTimeout(() => {
              this.showNRCExistsErrorMessage = false;
            }, 3000);
            event.target.value = null;
            return;
          }
        }

        console.log(importedData);

        this.service.bulkCreate(importedData).subscribe({
          next: (result: any) => {
            console.log('Excel datas saved successfully', result);
            this.getstudent();
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

  // ID Validation
  // validateExcelData(importedData: any[]): boolean {
  //   const idSet = new Set();
  //   // const nameSet = new Set();
  //   for (const row of importedData) {
  //     // Check if id is a number and is unique
  //     if (isNaN(row.id) || typeof row.id !== 'number' || idSet.has(row.id)) {
  //       return false;
  //     } else {
  //       console.error(
  //         'Invalid or duplicate id . Must be a unique number or order ID cannot be null'
  //       );
  //       this.showIdErrorMessage = true;
  //       setTimeout(() => {
  //         this.showIdErrorMessage = false;
  //       }, 3000);
  //     }
  //     idSet.add(row.id);
  //     // nameSet.add(row.name.trim().toLowerCase());
  //   }
  //   return true;
  // }

  // Name Validation
  // validateExcelName(importedData: any[]): string[] {
  //   const idSet = new Set();
  //   const errors: string[] = [];
  //   const nameSet = new Set();

  //   for (const row of importedData) {
  //     // Check if id is a number and is unique
  //     if (isNaN(row.id) || typeof row.id !== 'number' || idSet.has(row.id)) {
  //       errors.push(`Invalid ID for row with name '${row.name}'`);
  //     }
  //     // Check if name is a non-empty string and is unique
  //     if (
  //       typeof row.name !== 'string' ||
  //       row.name.trim() === '' ||
  //       nameSet.has(row.name.trim().toLowerCase())
  //     ) {
  //       errors.push(`Invalid name for row with ID '${row.id}'`);
  //     }
  //     idSet.add(row.id);
  //     nameSet.add(row.name.trim().toLowerCase());
  //   }
  //   return errors;
  // }
  // Add
  async savestudent(form: any) {
    console.log(this.students);
    var saveData = {
      Student_id: this.students.Student_id,
      Name: this.students.Name,
      Father_Name: this.students.Father_Name,
      Date_of_Birth: this.students.Date_of_Birth,
      Gender: this.students.Gender,
      Nrc_Exists: this.students.Nrc_Exists,
      Nrc: this.students.Nrc,
    };
    await this.service.studentsApiData(saveData).subscribe({
      next: (result: any) => {
        console.log('Student adds successfully!');

        this.results.push(saveData);
        form.resetForm();
        // asscending order
        this.results.sort((a: any, b: any) => a.id - b.id);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },

      error: (error: any) => {
        console.log('FAIL', error);
        alert('Student Id already exists');
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
        // descending order
        console.log(this.results);
        this.results.sort((a: any, b: any) => a.Student_id - b.Student_id);
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }

  // Delete
  async deletestudent() {
    await this.service.destroystudents(this.students.Student_id).subscribe({
      next: (result: any) => {
        console.log('Deleted Sussessfully!');
        this.getstudent();
      },
      error: (error: any) => {
        alert('FAIL!');
      },
    });
  }

  // Delete all
  async deleteallstudents() {
    await this.service.destroystudents(this.students.Student_id).subscribe({
      next: (result: any) => {
        console.log('Deleted Sussessfully!');
        this.getstudent();
      },
      error: (error: any) => {
        alert('FAIL!');
      },
    });
  }

  // Update
  async updatestudent() {
    var updatedata = {
      Name: this.array.Name,
      Father_Name: this.array.Father_Name,
      Date_of_birth: this.array.Date_of_Birth || Date.now(),
      Gender: this.array.Gender,
      Nrc_Exists: this.array.Nrc_Exists,
      Nrc: this.array.Nrc || null,
    };
    await this.service
      .updatestudents(this.array.Student_id, updatedata)
      .subscribe({
        next: (result: any) => {
          console.log('Updated Successfully!', result);
          this.getstudent();
        },
        error: (error: any) => {
          alert('FAIL!');
        },
      });
  }

  new_data(form: any) {
    form.resetForm();
  }

  getId(id: any) {
    return (this.students.Student_id = id);
  }

  getarray(data: any) {
    //data assign
    this.array = data;
    this.shouldnavigate = false;
  }
  nonavigate() {
    this.shouldnavigate = true;
  }
  //route
  getStudentArrayId(result: any) {
    this.service.setStudentId(result.Student_id);
    this.nonavigate();
  }

  // Validation
  valiAge(): boolean {
    if (!this.students.Date_of_Birth) {
      return false;
    }
    const birthDate = new Date(this.students.Date_of_Birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    return age < 18;
  }
  // Clear NRC
  clearNrc() {
    if (this.students.Nrc_Exists == false) {
      this.array.Nrc == '';
    }
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
  }
  toggleNRCInput() {
    throw new Error('Method not implemented.');
  }

  addStudent() {
    this.service.setStudentId(null);
    this.route.navigate(['/details']);
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
