import {User} from './user';
import {Material} from './material';
import {Suppliertype} from './suppliertype';
import {DataPage} from '../shared/data-page';
import {Supplierstatus} from './supplierstatus';

export class Supplier {
  id: number;
  code: string;
  name: string;
  suppliertype: Suppliertype;
  materialList: Material[];
  contact1: string;
  contact2: string;
  fax: string;
  email: string;
  address: string;
  supplierstatus: Supplierstatus;
  creator: User;
  tocreation: string;
}

export class SupplierDataPage extends DataPage{
    content: Supplier[];
}
