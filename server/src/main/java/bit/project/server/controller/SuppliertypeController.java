package bit.project.server.controller;

import bit.project.server.dao.CivilstatusDao;
import bit.project.server.dao.SupplierstatusDao;
import bit.project.server.dao.SuppliertypeDao;
import bit.project.server.entity.Civilstatus;
import bit.project.server.entity.Suppliertype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/suppliertypes")
public class SuppliertypeController {

    @Autowired
    private SuppliertypeDao suppliertypeDao;

    @GetMapping
    public List<Suppliertype> getAll(){
        return suppliertypeDao.findAll();
    }
}
