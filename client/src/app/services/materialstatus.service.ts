import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Materialstatus} from '../entities/materialstatus';

@Injectable({
  providedIn: 'root'
})
export class MaterialstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Materialstatus[]>{
    const materialstatuses = await this.http.get<Materialstatus[]>(ApiManager.getURL('materialstatuses')).toPromise();
    return materialstatuses.map((materialstatus) => Object.assign(new Materialstatus(), materialstatus));
  }

}
