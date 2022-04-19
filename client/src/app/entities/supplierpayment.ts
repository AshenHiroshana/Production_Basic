import {User} from './user';
import {Purchase} from './purchase';
import {Paymenttype} from './paymenttype';
import {DataPage} from '../shared/data-page';
import {Paymentstatus} from './paymentstatus';

export class Supplierpayment {
  id: number;
  code: string;
  purchase: Purchase;
  date: string;
  amount: number;
  paymenttype: Paymenttype;
  chequeno: string;
  chequedate: string;
  chequebank: string;
  chequebranch: string;
  paymentstatus: Paymentstatus;
  creator: User;
  tocreation: string;
}

export class SupplierpaymentDataPage extends DataPage{
    content: Supplierpayment[];
}
