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
      return moment().diff(value, 'years');
    }

  }

}
