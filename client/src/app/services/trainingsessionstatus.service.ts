import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiManager} from '../shared/api-manager';
import {Trainingsessionstatus} from '../entities/trainingsessionstatus';

@Injectable({
  providedIn: 'root'
})
export class TrainingsessionstatusService {

  constructor(private http: HttpClient) { }

  async getAll(): Promise<Trainingsessionstatus[]>{
    const trainingsessionstatuses = await this.http.get<Trainingsessionstatus[]>(ApiManager.getURL('trainingsessionstatuses')).toPromise();
    return trainingsessionstatuses.map((trainingsessionstatus) => Object.assign(new Trainingsessionstatus(), trainingsessionstatus));
  }

}
