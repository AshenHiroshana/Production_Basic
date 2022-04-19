package bit.project.server.controller;

import bit.project.server.dao.DistrictDao;
import bit.project.server.entity.District;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/districts")
public class DistrictController {

    @Autowired
    private DistrictDao districtDao;

    @GetMapping
    public List<District> getAll(){ return districtDao.findAll();
    }
}
