import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary'
})
export class SummaryPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(!value)
        return null;
    return value.slice(0,50) + '...'
  }


}
