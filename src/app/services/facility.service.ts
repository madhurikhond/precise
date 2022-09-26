import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class FacilityService {
  private search = new BehaviorSubject<string>('');
  searchResult = this.search.asObservable()
  private userType = new BehaviorSubject<string>('');
  selectedUserType = this.userType.asObservable()
  @Output() clearClickedEvent = new EventEmitter<string>();

  constructor() { }
  
    updateFacilityService(_search:any,_userType:any)
    {
      this.search.next(_search);
      this.userType.next(_userType);
    }
     resetFilters(msg:string) {
      this.clearClickedEvent.emit(msg);
    }
}
