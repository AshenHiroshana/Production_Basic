package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class PaymenttypeData extends AbstractSeedClass {

    public PaymenttypeData(){
        addIdNameData(1, "Cash");
        addIdNameData(2, "Cheque");
    }

}