package bit.project.server.trigger;

import bit.project.server.util.trigger.Trigger;

public class MaterialdisposalDelete extends Trigger{

    @Override
    public String getName() {
        return "materialdisposal_delete";
    }

    @Override
    public Event getEvent() {
        return Event.AFTER_DELETE;
    }

    @Override
    public String getTableName() {
        return "materialdisposalmaterial";
    }

    public MaterialdisposalDelete(){
        addBodyLine("    update material set qty = qty + OLD.qty where id = OLD.material_id;");
    }

}
