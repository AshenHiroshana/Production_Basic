import {DataPage} from '../shared/data-page';
import {User} from './user';
import {Productstatus} from './productstatus';
import {Producttype} from './producttype';

export class Product{
  id: number;
  code: string;
  tocreation: string;
  description: string;
  creator: User;
  name: string;
  photo: string;
  price: number;
  producttype: Producttype;
  productstatus: Productstatus;

  constructor(id: number= null) {
    this.id = id;
  }
}

export class ProductDataPage extends DataPage{
  content: Product[];
}
