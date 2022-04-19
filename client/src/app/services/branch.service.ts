import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PageRequest} from '../shared/page-request';
import {Branch, BranchDataPage} from '../entities/branch';
import {ApiManager} from '../shared/api-manager';
import {ResourceLink} from '../shared/resource-link';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  constructor(private http: HttpClient) {
  }

  async getAll(pageRequest: PageRequest): Promise<BranchDataPage> {
    const url = pageRequest.getPageRequestURL('branches');
    const branchDataPage = await this.http.get<BranchDataPage>(ApiManager.getURL(url)).toPromise();
    branchDataPage.content = branchDataPage.content.map((branch) => Object.assign(new Branch(), branch));
    return branchDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<BranchDataPage> {
    const url = pageRequest.getPageRequestURL('branches/basic');
    const branchDataPage = await this.http.get<BranchDataPage>(ApiManager.getURL(url)).toPromise();
    branchDataPage.content = branchDataPage.content.map((branch) => Object.assign(new Branch(), branch));
    return branchDataPage;
  }

  async get(id: number): Promise<Branch> {
    const branch: Branch = await this.http.get<Branch>(ApiManager.getURL(`branches/${id}`)).toPromise();
    return Object.assign(new Branch(), branch);
  }

  async delete(id: number): Promise<void> {
    return this.http.delete<void>(ApiManager.getURL(`branches/${id}`)).toPromise();
  }

  async add(branch: Branch): Promise<ResourceLink> {
    return this.http.post<ResourceLink>(ApiManager.getURL(`branches`), branch).toPromise();
  }

  async update(id: number, branch: Branch): Promise<ResourceLink> {
    return this.http.put<ResourceLink>(ApiManager.getURL(`branches/${id}`), branch).toPromise();
  }
}
