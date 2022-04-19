import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Routestatus} from '../entities/routestatus';

@Injectable({
  providedIn: 'root'
})
export class RoutestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Routestatus[]>{
    const routestatuses = await this.http.get<Routestatus[]>(ApiManager.getURL('routestatuses')).toPromise();
    return routestatuses.map((routestatus) => Object.assign(new Routestatus(), routestatus));
  }

}
