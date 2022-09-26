import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bookmark'
})
export class BookmarkPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    var result1 = items.filter((it) => it['TableName'].toLowerCase().includes(searchText));
    var result2 = items.filter(a => a.TableColumns.some(u => u.SqlFields.toLowerCase().includes(searchText)));
    var result3 = items.filter(a => a.TableColumns.some(u => u.Description.toLowerCase().includes(searchText)));
    return Array.from(new Set(result1.concat(result2).concat(result3)));
  }
}

@Pipe({
  name: 'sqlField'
})
export class SqlFieldPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    var result1 = items.filter((it) => it['SqlFields'].toLowerCase().includes(searchText));
    var result2 = items.filter((it) => it['Description'].toLowerCase().includes(searchText));
    return Array.from(new Set(result1.concat(result2)));
  }
}
