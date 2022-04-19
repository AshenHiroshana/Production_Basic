package bit.project.server.controller;

import bit.project.server.dao.VehicletypeDao;
import bit.project.server.entity.Vehicletype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/vehicletypes")
public class VehicletypeController {

    @Autowired
    private VehicletypeDao vehicletypeDao;

    @GetMapping
    public List<Vehicletype> getAll(){
        return vehicletypeDao.findAll();
    }
}
