package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Porderstatus;
import bit.project.server.dao.PorderstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/porderstatuses")
public class PorderstatusController{

    @Autowired
    private PorderstatusDao porderstatusDao;

    @GetMapping
    public List<Porderstatus> getAll(){
        return porderstatusDao.findAll();
    }
}