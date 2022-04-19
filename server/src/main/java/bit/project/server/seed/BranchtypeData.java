package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class BranchtypeData  extends AbstractSeedClass {

    public BranchtypeData(){
        addIdNameData(1, "Manufacturing");
        addIdNameData(2, "Managing");

    }
}
