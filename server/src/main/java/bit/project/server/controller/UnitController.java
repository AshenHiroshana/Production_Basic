package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Unit;
import bit.project.server.dao.UnitDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/units")
public class UnitController{

    @Autowired
    private UnitDao unitDao;

    @GetMapping
    public List<Unit> getAll(){
        return unitDao.findAll();
    }
}