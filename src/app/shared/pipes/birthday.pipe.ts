import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'birthday'
})
export class BirthdayPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (args === undefined) {
      return value;
    }

    if (value.length > args) {
      const diffYear = moment().diff(value, 'years');
      let text = '';
      if (diffYear > 0) {
        text = (diffYear > 1) ? '(years old)' : '(year old)';
      }
      return diffYear + ' ' + text;
    }

  }

}
