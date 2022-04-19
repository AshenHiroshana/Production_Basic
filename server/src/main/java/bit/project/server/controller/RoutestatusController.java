package bit.project.server.controller;

import bit.project.server.dao.RoutestatusDao;
import bit.project.server.entity.Routestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/routestatuses")
public class RoutestatusController {

    @Autowired
    private RoutestatusDao routestatusDao;

    @GetMapping
    public List<Routestatus> getAll(){
        return routestatusDao.findAll();
    }
}
