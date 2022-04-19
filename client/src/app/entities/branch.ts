
import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Branchtype} from './branchtype';
import {Branchstatus} from './branchstatus';

export class Branch {

  id: number;
  code: string;
  tocreation: string;
  description: string;
  name: string;
  tel1: string;
  tel2: string;
  address: string;
  email: string;
  fax: string;
  branchtype: Branchtype;
  branchstatus: Branchstatus;
  creator: User;

  constructor(id: number = null) {
    this.id = id;
  }

}

export class BranchDataPage extends DataPage{
  content: Branch[];
}
