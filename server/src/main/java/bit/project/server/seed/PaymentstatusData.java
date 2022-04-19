package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PaymentstatusData extends AbstractSeedClass {

    public PaymentstatusData(){
        addIdNameData(1, "Done");
        addIdNameData(2, "Cancled");
        addIdNameData(3, "Cheque Pending");
        addIdNameData(4, "Cheque Rejected");
        addIdNameData(5, "Cheque Approved");
    }

}