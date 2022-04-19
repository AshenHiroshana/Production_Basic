package bit.project.server.controller;

import bit.project.server.dao.BranchtypeDao;
import bit.project.server.entity.Branchtype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/branchtypes")

public class Branchtypecontroller {
    @Autowired
    private BranchtypeDao branchtypeDao;

    @GetMapping
    public List<Branchtype> getAll(){
        return branchtypeDao.findAll();
    }
}
