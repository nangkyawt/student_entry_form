import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../service/api.service';
import { HttpClient } from '@angular/common/http';
import { throttle } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css'],
})
export class StudentFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private http: HttpClient, private service: ApiService) {}
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
    id: 0,
    name: '',
    father_name: '',
    date_of_birth: '',
    gender: true,
    nrc_exists: false,
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
  // Export to Excel
  exportToExcel(data: any[], fileName: string): void {
    // Exclude unwanted columns (e.g., CreatedAt and UpdatedAt)
    const excludedColumns = ['createdAt', 'updatedAt'];
    const modifiedData = data.map((item) => {
      const newItem = { ...item };
      if (newItem.gender !== undefined) {
        newItem.gender == newItem.gender ? 'Male' : 'Female';
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
      id: this.students.id,
      name: this.students.name,
      father_name: this.students.father_name,
      date_of_birth: this.students.date_of_birth,
      gender: this.students.gender,
      nrc_exists: this.students.nrc_exists,
      nrc: this.students.nrc,
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
        result.data.sort((a: any, b: any) => a.id - b.id);
      },
      error: (error: any) => {
        console.log('FAIL', error);
      },
    });
  }

  // Delete
  async deletestudent() {
    await this.service.destroystudents(this.students.id).subscribe({
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
    await this.service.destroystudents(this.students.id).subscribe({
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
      name: this.array.name,
      father_name: this.array.father_name,
      date_of_birth: this.array.date_of_birth || Date.now(),
      gender: this.array.gender,
      nrc_exists: this.array.nrc_exists,
      nrc: this.array.nrc || null,
    };
    await this.service.updatestudents(this.array.id, updatedata).subscribe({
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
    return (this.students.id = id);
  }

  getarray(data: any) {
    //data assign
    this.array = data;
    this.shouldnavigate = false;
  }
  nonavigate() {
    this.shouldnavigate = true;
  }

  // Validation
  valiAge(): boolean {
    if (!this.students.date_of_birth) {
      return false;
    }
    const birthDate = new Date(this.students.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    return age < 18;
  }
  // Clear NRC
  clearNrc() {
    if (this.students.nrc_exists == false) {
      this.array.nrc == '';
    }
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
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
