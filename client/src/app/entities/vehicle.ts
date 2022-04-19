import {User} from './user';
import {Vehicletype} from './vehicletype';
import {Vehiclestatus} from './vehiclestatus';
import {DataPage} from '../shared/data-page';

export class Vehicle {
  id: number;
  tocreation: string;
  description: string;
  photo: string;
  brand: string;
  model: string;
  creator: User;
  vehicletype: Vehicletype;
  vehiclestatus: Vehiclestatus ;
  no: string;


  constructor(id: number = null) {
    this.id = id;
  }
}
export class VehicleDataPage extends DataPage{
  content: Vehicle[];
}
