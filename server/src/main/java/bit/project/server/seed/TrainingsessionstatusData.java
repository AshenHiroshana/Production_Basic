package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class TrainingsessionstatusData extends AbstractSeedClass {

    public TrainingsessionstatusData(){
        addIdNameData(1, "Not Completed");
        addIdNameData(2, "Completed");
        addIdNameData(3, "Cancelled");
    }

}
