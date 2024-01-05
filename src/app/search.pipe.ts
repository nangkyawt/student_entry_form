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
        (students.name && students.name.toLowerCase().includes(searchText)) ||
        (students.id && students.id.toString().includes(searchText)) ||
        (students.father_name &&
          students.father_name.toLowerCase().includes(searchText)) ||
        (students.gender === 'String' &&
          students.gender.toLowerCase().includes(searchText)) ||
        (students.nrc && students.nrc.toLowerCase().includes(searchText)) ||
        (students.date_of_birth === 'Date' &&
          students.date_of_birth.toLowerCase().includes(searchText))
    );
  }
}
