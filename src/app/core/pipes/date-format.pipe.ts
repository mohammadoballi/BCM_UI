import { Pipe, PipeTransform } from '@angular/core';
import { formatDateToYYYYMMDD } from '../utils/date.utils';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null | undefined): string {
    return formatDateToYYYYMMDD(value);
  }
}
