package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class RoutestatusData extends AbstractSeedClass {

    public RoutestatusData(){
        addIdNameData(1, "Active");
        addIdNameData(2, "Deactive");
    }

}
