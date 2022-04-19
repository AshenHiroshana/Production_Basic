import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Materialtype} from '../entities/materialtype';

@Injectable({
  providedIn: 'root'
})
export class MaterialtypeService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Materialtype[]>{
    const materialtypes = await this.http.get<Materialtype[]>(ApiManager.getURL('materialtypes')).toPromise();
    return materialtypes.map((materialtype) => Object.assign(new Materialtype(), materialtype));
  }

}
