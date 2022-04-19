import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Clientstatus} from './clientstatus';

export class Client{
  id: number;
  code: string;
  tocreation: string;
  description: string;
  name: string;
  contact1: string;
  contact2: string;
  address: string;
  email: string;
  fax: string;
  creator: User;
  clientstatus: Clientstatus;


  constructor(id: number = null) {
    this.id = id;
  }
}
export class ClientDataPage extends DataPage{
  content: Client[];
}
