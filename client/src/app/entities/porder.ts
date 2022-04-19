import {User} from './user';
import {Supplier} from './supplier';
import {Porderstatus} from './porderstatus';
import {DataPage} from '../shared/data-page';
import {Pordermaterial} from './pordermaterial';

export class Porder {
  id: number;
  code: string;
  doordered: string;
  dorequired: string;
  doreceived: string;
  supplier: Supplier;
  pordermaterialList: Pordermaterial[];
  porderstatus: Porderstatus;
  description: string;
  creator: User;
  tocreation: string;
}

export class PorderDataPage extends DataPage{
    content: Porder[];
}
