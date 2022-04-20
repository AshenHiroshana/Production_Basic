import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Productstatus} from '../entities/productstatus';

@Injectable({
  providedIn: 'root'
})
export class ProductstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Productstatus[]>{
    const productstatuses = await this.http.get<Productstatus[]>(ApiManager.getURL('productstatuses')).toPromise();
    return productstatuses.map((productstatus) => Object.assign(new Productstatus(), productstatus));
  }

}
