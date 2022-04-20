package bit.project.server.controller;

import bit.project.server.dao.ProductstatusDao;
import bit.project.server.entity.Productstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/productstatuses")
public class ProductstatusController {

    @Autowired
    private ProductstatusDao productstatusDao;

    @GetMapping
    public List<Productstatus> getAll(){
        return productstatusDao.findAll();
    }
}
