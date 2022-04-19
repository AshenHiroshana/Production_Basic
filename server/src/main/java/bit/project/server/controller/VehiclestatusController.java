package bit.project.server.controller;

import bit.project.server.dao.VehiclestatusDao;
import bit.project.server.entity.Vehiclestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/vehiclestatuses")
public class VehiclestatusController {

    @Autowired
    private VehiclestatusDao vehiclestatusDao;

    @GetMapping
    public List<Vehiclestatus> getAll(){
        return vehiclestatusDao.findAll();
    }
}
