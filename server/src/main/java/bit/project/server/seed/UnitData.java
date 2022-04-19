package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class UnitData extends AbstractSeedClass {

    public UnitData(){
        addIdNameData(1, "Packets");
        addIdNameData(2, "Bottles");
        addIdNameData(3, "Kg");
    }

}