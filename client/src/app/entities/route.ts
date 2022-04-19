import {User} from './user';
import {District} from './district';
import {Routestatus} from './routestatus';
import {DataPage} from '../shared/data-page';
import {Vehicle} from './vehicle';
import {Employee} from './employee';

export class Route{
  id: number;
  code: string;
  tocreation: string;
  description: string;
  name: string;
  timegap: number;
  creator: User;
  ref: Employee;
  district: District;
  routestatus: Routestatus;
  vehicle: Vehicle;


  constructor(id: number = null) {
    this.id = id;
  }
}
export class RouteDataPage extends DataPage{
  content: Route[];
}

