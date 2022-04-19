import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Vehiclestatus} from '../entities/vehiclestatus';

@Injectable({
  providedIn: 'root'
})
export class VehiclestatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Vehiclestatus[]>{
    const vehiclestatuses = await this.http.get<Vehiclestatus[]>(ApiManager.getURL('vehiclestatuses')).toPromise();
    return vehiclestatuses.map((vehiclestatus) => Object.assign(new Vehiclestatus(), vehiclestatus));
  }

}
