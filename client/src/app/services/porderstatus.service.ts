import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Porderstatus} from '../entities/porderstatus';

@Injectable({
  providedIn: 'root'
})
export class PorderstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Porderstatus[]>{
    const porderstatuses = await this.http.get<Porderstatus[]>(ApiManager.getURL('porderstatuses')).toPromise();
    return porderstatuses.map((porderstatus) => Object.assign(new Porderstatus(), porderstatus));
  }

}
