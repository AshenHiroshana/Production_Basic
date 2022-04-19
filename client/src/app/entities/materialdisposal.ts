import {User} from './user';
import {DataPage} from '../shared/data-page';
import {Materialdisposalmaterial} from './materialdisposalmaterial';

export class Materialdisposal {
  id: number;
  code: string;
  date: string;
  materialdisposalmaterialList: Materialdisposalmaterial[];
  reason: string;
  creator: User;
  tocreation: string;
}

export class MaterialdisposalDataPage extends DataPage{
    content: Materialdisposal[];
}
