import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Branchtype} from '../entities/branchtype';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class BranchtypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Branchtype[]>{
    const branchtypes = await this.http.get<Branchtype[]>(ApiManager.getURL('branchtypes')).toPromise();
    return branchtypes.map((branchtype) => Object.assign(new Branchtype(), branchtype));
  }
}
