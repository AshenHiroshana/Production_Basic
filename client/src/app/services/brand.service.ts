import {Brand} from '../entities/brand';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Brand[]>{
    const brands = await this.http.get<Brand[]>(ApiManager.getURL('brands')).toPromise();
    return brands.map((brand) => Object.assign(new Brand(), brand));
  }

  async getAllByMaterial(material: string): Promise<Brand[]>{
    const brands = await this.http.get<Brand[]>(ApiManager.getURL(`brands/material/${material}`)).toPromise();
    return brands.map((brand) => Object.assign(new Brand(), brand));
  }

  async getAllByMaterialWithThis(id: number, material: string): Promise<Brand[]>{
    const brands = await this.http.get<Brand[]>(ApiManager.getURL(`brands/materialWithThis/${id}/${material}`)).toPromise();
    return brands.map((brand) => Object.assign(new Brand(), brand));
  }

}
