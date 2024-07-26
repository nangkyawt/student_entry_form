import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nrcExists',
})
export class NrcExistsPipe implements PipeTransform {
  transform(value: boolean): string {
    return value == true ? 'Yes' : 'No';
  }
}
