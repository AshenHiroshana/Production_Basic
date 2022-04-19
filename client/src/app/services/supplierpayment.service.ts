import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Supplierpayment, SupplierpaymentDataPage} from '../entities/supplierpayment';

@Injectable({
  providedIn: 'root'
})
export class SupplierpaymentService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<SupplierpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('supplierpayments');
    const supplierpaymentDataPage = await this.http.get<SupplierpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    supplierpaymentDataPage.content = supplierpaymentDataPage.content.map((supplierpayment) => Object.assign(new Supplierpayment(), supplierpayment));
    return supplierpaymentDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<SupplierpaymentDataPage>{
    const url = pageRequest.getPageRequestURL('supplierpayments/basic');
    const supplierpaymentDataPage = await this.http.get<SupplierpaymentDataPage>(ApiManager.getURL(url)).toPromise();
    supplierpaymentDataPage.content = supplierpaymentDataPage.content.map((supplierpayment) => Object.assign(new Supplierpayment(), supplierpayment));
    return supplierpaymentDataPage;
  }

  async get(id: number): Promise<Supplierpayment>{
    const supplierpayment: Supplierpayment = await this.http.get<Supplierpayment>(ApiManager.getURL(`supplierpayments/${id}`)).toPromise();
    return Object.assign(new Supplierpayment(), supplierpayment);
  }

  async getByPurchaseID(id: number): Promise<Supplierpayment>{
    const supplierpayment: Supplierpayment = await this.http.get<Supplierpayment>(ApiManager.getURL(`supplierpayments/basic/${id}`)).toPromise();
    return Object.assign(new Supplierpayment(), supplierpayment);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`supplierpayments/${id}`)).toPromise();
  }

  async add(supplierpayment: Supplierpayment): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`supplierpayments`), supplierpayment).toPromise();
  }

  async update(id: number, supplierpayment: Supplierpayment): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`supplierpayments/${id}`), supplierpayment).toPromise();
  }

}
