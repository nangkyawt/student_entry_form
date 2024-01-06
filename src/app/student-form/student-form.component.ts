import { Component, OnInit } from '@angular/core';
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
  data: any;

  constructor(private http: HttpClient, private service: ApiService) {}
  pageSize: any = 5;
  currentPage = 1;
  searchText: any;

  results: any = [];
  array: any = [];
  excel_data: any = [];
  // import_data: any = [];
  showSuccessMessage = false;
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

  // Add
  async savestudent() {
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
        console.log('Student add successfully!');

        this.results.push(saveData);
        // asscending order
        this.results.sort((a: any, b: any) => a.id - b.id);
        this.showSuccessMessage = true;
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
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

  // Export Excel

  exportToExcel(data: any, filenName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${filenName}.xlsx`);
  }

  // Import Excel
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
        // Process the imported data as needed
        console.log(importedData);
        // const dataWithUniqueIds = importedData.map(record => {
        //   return { ...record, Epl_id: uuidv4() };
        // });
        this.service.bulkCreate(importedData).subscribe({
          next: (result: any) => {
            console.log('Excel datas saved successfully', result);
            this.getstudent();
          },
          error: (error: any) => {
            console.log('Error Saving datas form Excel', error);
          },
        });
        // Assuming you have a method in your service to handle bulk insertion
      };
      reader.readAsBinaryString(file);
    }
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
