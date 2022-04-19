import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Branchstatus} from '../entities/branchstatus';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class BranchstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchstatus[]>{
    const branchstatuses = await this.http.get<Branchstatus[]>(ApiManager.getURL('branchstatuses')).toPromise();
    return branchstatuses.map((branchstatus) => Object.assign(new Branchstatus(), branchstatus));
  }
}
