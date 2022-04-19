import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Materialdisposal, MaterialdisposalDataPage} from '../entities/materialdisposal';

@Injectable({
  providedIn: 'root'
})
export class MaterialdisposalService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<MaterialdisposalDataPage>{
    const url = pageRequest.getPageRequestURL('materialdisposals');
    const materialdisposalDataPage = await this.http.get<MaterialdisposalDataPage>(ApiManager.getURL(url)).toPromise();
    materialdisposalDataPage.content = materialdisposalDataPage.content.map((materialdisposal) => Object.assign(new Materialdisposal(), materialdisposal));
    return materialdisposalDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<MaterialdisposalDataPage>{
    const url = pageRequest.getPageRequestURL('materialdisposals/basic');
    const materialdisposalDataPage = await this.http.get<MaterialdisposalDataPage>(ApiManager.getURL(url)).toPromise();
    materialdisposalDataPage.content = materialdisposalDataPage.content.map((materialdisposal) => Object.assign(new Materialdisposal(), materialdisposal));
    return materialdisposalDataPage;
  }

  async get(id: number): Promise<Materialdisposal>{
    const materialdisposal: Materialdisposal = await this.http.get<Materialdisposal>(ApiManager.getURL(`materialdisposals/${id}`)).toPromise();
    return Object.assign(new Materialdisposal(), materialdisposal);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`materialdisposals/${id}`)).toPromise();
  }

  async add(materialdisposal: Materialdisposal): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`materialdisposals`), materialdisposal).toPromise();
  }

  async update(id: number, materialdisposal: Materialdisposal): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`materialdisposals/${id}`), materialdisposal).toPromise();
  }

}
