import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Vehicle, VehicleDataPage} from '../entities/vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<VehicleDataPage>{
    const url = pageRequest.getPageRequestURL('vehicles');
    const vehicleDataPage = await this.http.get<VehicleDataPage>(ApiManager.getURL(url)).toPromise();
    vehicleDataPage.content = vehicleDataPage.content.map((vehicle) => Object.assign(new Vehicle(), vehicle));
    return vehicleDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<VehicleDataPage>{
    const url = pageRequest.getPageRequestURL('vehicles/basic');
    const vehicleDataPage = await this.http.get<VehicleDataPage>(ApiManager.getURL(url)).toPromise();
    vehicleDataPage.content = vehicleDataPage.content.map((vehicle) => Object.assign(new Vehicle(), vehicle));
    return vehicleDataPage;
  }

  async get(id: number): Promise<Vehicle>{
    const vehicle: Vehicle = await this.http.get<Vehicle>(ApiManager.getURL(`vehicles/${id}`)).toPromise();
    console.log(vehicle);
    return Object.assign(new Vehicle(), vehicle);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`vehicles/${id}`)).toPromise();
  }

  async add(vehicle: Vehicle): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`vehicles`), vehicle).toPromise();
  }

  async update(id: number, vehicle: Vehicle): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`vehicles/${id}`), vehicle).toPromise();
  }

  async getPhoto(id: number): Promise<any>{
    return await this.http.get<any>(ApiManager.getURL(`vehicles/${id}/photo`)).toPromise();
  }


}
