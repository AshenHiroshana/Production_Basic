package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class ProducttypeData extends AbstractSeedClass {

    public ProducttypeData(){
        addIdNameData(1, "Fire Extinguisher");
        addIdNameData(2, "Fire Ball");
        addIdNameData(3, "Alarm System");
        addIdNameData(4, "Body Kit");
    }

}
