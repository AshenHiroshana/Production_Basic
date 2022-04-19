package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class PurchaseDelete extends Trigger{

    @Override
    public String getName() {
        return "purchase_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "purchasematerial";
    }

    public PurchaseDelete(){
        addBodyLine("    update material set qty = qty - OLD.qty where id = OLD.material_id;");
    }

}
