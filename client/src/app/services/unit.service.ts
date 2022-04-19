import {Unit} from '../entities/unit';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Unit[]>{
    const units = await this.http.get<Unit[]>(ApiManager.getURL('units')).toPromise();
    return units.map((unit) => Object.assign(new Unit(), unit));
  }

}
