package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Materialtype;
import bit.project.server.dao.MaterialtypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/materialtypes")
public class MaterialtypeController{

    @Autowired
    private MaterialtypeDao materialtypeDao;

    @GetMapping
    public List<Materialtype> getAll(){
        return materialtypeDao.findAll();
    }
}