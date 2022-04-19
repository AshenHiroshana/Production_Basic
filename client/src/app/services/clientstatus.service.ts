import {Injectable} from '@angular/core';
import {Clientstatus} from '../entities/clientstatus';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class ClientstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Clientstatus[]>{
    const clientstatuses = await this.http.get<Clientstatus[]>(ApiManager.getURL('clientstatuses')).toPromise();
    return clientstatuses.map((clientstatus) => Object.assign(new Clientstatus(), clientstatus));
  }

}
