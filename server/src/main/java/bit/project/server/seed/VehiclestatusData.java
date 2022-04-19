package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class VehiclestatusData extends AbstractSeedClass {

    public VehiclestatusData(){
        addIdNameData(1, "Available");
        addIdNameData(2, "Unavailable");
    }

}
