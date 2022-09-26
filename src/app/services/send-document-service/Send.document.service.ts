import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';
import { SendDocumentInput} from 'src/app/models/SendDocument';

@Injectable()
export class SendDocumentService {
  private sendDocumentSubject = new Subject<any>();
  sendDocumentSubjectObservable = this.sendDocumentSubject.asObservable();
  constructor(private readonly _httpService:HttpService) { }
  
  sendDataToDocumentSendComponent(data:any)
  {
    this.sendDocumentSubject.next(data);
  }
  getUsers(showGlobalLoader : boolean = true ,patientId: string){
    return this._httpService.get(`SendDocument/GetSendDocumentUsers?patientId=${patientId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  sendDocumentToUser(showGlobalLoader: boolean = true, body: SendDocumentInput) {
    return this._httpService.post(`SendDocument/SendDocumentToUser`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllState(showGlobalLoader : boolean = true){
    return this._httpService.get('MasterValues/GetAllState', showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}
