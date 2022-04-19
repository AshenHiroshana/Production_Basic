package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PurchaseInsert extends Trigger{

    @Override
    public String getName() {
        return "purchase_insert";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_INSERT;
    }

    @Override
    public String getTableName() {
        return "purchasematerial";
    }

    public PurchaseInsert(){
        addBodyLine("    update material set qty = qty + NEW.qty where id = NEW.material_id;");
        addBodyLine("    update material set lastpurchaseprice = NEW.unitprice where id = NEW.material_id;");
    }

}
