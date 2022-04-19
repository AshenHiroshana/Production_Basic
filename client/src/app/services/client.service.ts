import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Client, ClientDataPage} from '../entities/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<ClientDataPage>{
    const url = pageRequest.getPageRequestURL('clients');
    const clientDataPage = await this.http.get<ClientDataPage>(ApiManager.getURL(url)).toPromise();
    clientDataPage.content = clientDataPage.content.map((client) => Object.assign(new Client(), client));
    return clientDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<ClientDataPage>{
    const url = pageRequest.getPageRequestURL('clients/basic');
    const clientDataPage = await this.http.get<ClientDataPage>(ApiManager.getURL(url)).toPromise();
    clientDataPage.content = clientDataPage.content.map((client) => Object.assign(new Client(), client));
    return clientDataPage;
  }

  async get(id: number): Promise<Client>{
    const client: Client = await this.http.get<Client>(ApiManager.getURL(`clients/${id}`)).toPromise();
    return Object.assign(new Client(), client);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`clients/${id}`)).toPromise();
  }

  async add(client: Client): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`clients`), client).toPromise();
  }

  async update(id: number, client: Client): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`clients/${id}`), client).toPromise();
  }

}
