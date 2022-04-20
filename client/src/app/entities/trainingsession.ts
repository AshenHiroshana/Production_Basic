import {DataPage} from '../shared/data-page';
import {User} from './user';
import {Trainingsessionstatus} from './trainingsessionstatus';
import {Employee} from './employee';
import {Client} from './client';

export class Trainingsession{
  id: number;
  code: string;
  tocreation: string;
  description: string;
  creator: User;
  client: Client;
  date: string;
  stime: string;
  etime: string;
  venue: string;
  trainingsessionstatus: Trainingsessionstatus;

  employeeList: Employee[];

  constructor(id: number= null) {
    this.id = id;
  }
}

export class TrainingsessionDataPage extends DataPage{
  content: Trainingsession[];
}
