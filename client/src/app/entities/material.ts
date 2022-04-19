import {Unit} from './unit';
import {User} from './user';
import {Brand} from './brand';
import {Materialtype} from './materialtype';
import {DataPage} from '../shared/data-page';
import {Materialstatus} from './materialstatus';

export class Material {
  id: number;
  code: string;
  materialtype: Materialtype;
  name: string;
  brand: Brand;
  unit: Unit;
  qty: number;
  lastpurchaseprice: number;
  rop: number;
  materialstatus: Materialstatus;
  creator: User;
  tocreation: string;
}

export class MaterialDataPage extends DataPage{
    content: Material[];
}
