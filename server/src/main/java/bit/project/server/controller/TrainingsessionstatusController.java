package bit.project.server.controller;

import bit.project.server.dao.TrainingsessionstatusDao;
import bit.project.server.entity.Trainingsession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/trainingsessionstatuses")
public class TrainingsessionstatusController {

    @Autowired
    private TrainingsessionstatusDao trainingsessionstatusDao;

    @GetMapping
    public List<Trainingsession> getAll(){
        return trainingsessionstatusDao.findAll();
    }
}
