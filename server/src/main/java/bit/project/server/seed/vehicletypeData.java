package bit.project.server.seed;

import bit.project.server.util.seed.AbstractSeedClass;
import bit.project.server.util.seed.SeedClass;

@SeedClass
public class vehicletypeData extends AbstractSeedClass {

    public vehicletypeData(){
        addIdNameData(1, "Lorry");
        addIdNameData(2, "Van");
        addIdNameData(3, "Three wheeler");
    }

}
