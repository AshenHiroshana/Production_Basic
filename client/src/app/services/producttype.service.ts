import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Producttype} from '../entities/producttype';

@Injectable({
  providedIn: 'root'
})
export class ProducttypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Producttype[]>{
    const producttypes = await this.http.get<Producttype[]>(ApiManager.getURL('producttypes')).toPromise();
    return producttypes.map((producttype) => Object.assign(new Producttype(), producttype));
  }

}
