package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class MaterialtypeData extends AbstractSeedClass {

    public MaterialtypeData(){
        addIdNameData(1, "Flour");
        addIdNameData(2, "Essance");
        addIdNameData(3, "Sugar");
        addIdNameData(4, "Gelatin");
        addIdNameData(5, "Other");
    }

}
