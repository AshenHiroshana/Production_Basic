package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Paymenttype;
import bit.project.server.dao.PaymenttypeDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/paymenttypes")
public class PaymenttypeController{

    @Autowired
    private PaymenttypeDao paymenttypeDao;

    @GetMapping
    public List<Paymenttype> getAll(){
        return paymenttypeDao.findAll();
    }
}