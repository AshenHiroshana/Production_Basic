import {User} from './user';
import {Porder} from './porder';
import {Supplier} from './supplier';
import {DataPage} from '../shared/data-page';
import {Purchasematerial} from './purchasematerial';

export class Purchase {
  id: number;
  code: string;
  date: string;
  supplier: Supplier;
  porder: Porder;
  purchasematerialList: Purchasematerial[];
  discount: number;
  total: number;
  description: string;
  creator: User;
  tocreation: string;
}

export class PurchaseDataPage extends DataPage{
    content: Purchase[];
}
