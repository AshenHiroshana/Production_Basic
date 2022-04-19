package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Materialstatus;
import bit.project.server.dao.MaterialstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/materialstatuses")
public class MaterialstatusController{

    @Autowired
    private MaterialstatusDao materialstatusDao;

    @GetMapping
    public List<Materialstatus> getAll(){
        return materialstatusDao.findAll();
    }
}