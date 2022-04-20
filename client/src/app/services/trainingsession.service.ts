import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {PageRequest} from '../shared/page-request';
import {ResourceLink} from '../shared/resource-link';
import {Trainingsession, TrainingsessionDataPage} from '../entities/trainingsession';

@Injectable({
  providedIn: 'root'
})
export class TrainingsessionService {

  constructor(private http: HttpClient) { }

  async getAll(pageRequest: PageRequest): Promise<TrainingsessionDataPage>{
    const url = pageRequest.getPageRequestURL('trainingsessions');
    const trainingsessionDataPage = await this.http.get<TrainingsessionDataPage>(ApiManager.getURL(url)).toPromise();
    trainingsessionDataPage.content = trainingsessionDataPage.content.map((trainingsession) => Object.assign(new Trainingsession(), trainingsession));
    return trainingsessionDataPage;
  }

  async getAllBasic(pageRequest: PageRequest): Promise<TrainingsessionDataPage>{
    const url = pageRequest.getPageRequestURL('trainingsessions/basic');
    const trainingsessionDataPage = await this.http.get<TrainingsessionDataPage>(ApiManager.getURL(url)).toPromise();
    trainingsessionDataPage.content = trainingsessionDataPage.content.map((trainingsession) => Object.assign(new Trainingsession(), trainingsession));
    return trainingsessionDataPage;
  }

  async get(id: number): Promise<Trainingsession>{
    const trainingsession: Trainingsession = await this.http.get<Trainingsession>(ApiManager.getURL(`trainingsessions/${id}`)).toPromise();
    return Object.assign(new Trainingsession(), trainingsession);
  }

  async delete(id: number): Promise<void>{
    return this.http.delete<void>(ApiManager.getURL(`trainingsessions/${id}`)).toPromise();
  }

  async add(trainingsession: Trainingsession): Promise<ResourceLink>{
    return this.http.post<ResourceLink>(ApiManager.getURL(`trainingsessions`), trainingsession).toPromise();
  }

  async update(id: number, trainingsession: Trainingsession): Promise<ResourceLink>{
    return this.http.put<ResourceLink>(ApiManager.getURL(`trainingsessions/${id}`), trainingsession).toPromise();
  }
}
