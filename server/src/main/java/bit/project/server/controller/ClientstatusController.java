package bit.project.server.controller;

import bit.project.server.dao.ClientstatusDao;
import bit.project.server.entity.Clientstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/clientstatuses")
public class ClientstatusController {

    @Autowired
    private ClientstatusDao clientstatusDao;

    @GetMapping
    public List<Clientstatus> getAll(){
        return clientstatusDao.findAll();
    }
}
