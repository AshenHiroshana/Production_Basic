package bit.project.server.controller;

import bit.project.server.dao.BranchstatusDao;
import bit.project.server.entity.Branchstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/branchstatuses")

public class BranchstatusController {
    @Autowired
    private BranchstatusDao branchstatusDao;

    @GetMapping
    public List<Branchstatus> getAll(){
        return branchstatusDao.findAll();
    }
}
