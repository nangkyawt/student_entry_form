import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(result: any, searchText: string): any {
    if (!Array.isArray(result) || !searchText) {
      return result;
    }
    searchText = searchText.toLowerCase();
    return result.filter(
      (students: any) =>
        (students.Name && students.Name.toLowerCase().includes(searchText)) ||
        (students.Student_id &&
          students.Student_id.toString().includes(searchText)) ||
        (students.Father_Name &&
          students.Father_Name.toLowerCase().includes(searchText)) ||
        (students.Gender === 'String' &&
          students.Gender.toLowerCase().includes(searchText)) ||
        (students.Nrc && students.Nrc.toLowerCase().includes(searchText)) ||
        (students.Date_of_Birth === 'Date' &&
          students.Date_of_Birth.toLowerCase().includes(searchText)) ||
        (students.Nrc_Exists === 'String' &&
          students.Nrc_Exists.toLowerCase().includes(searchText))
    );
  }
}
