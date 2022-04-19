package bit.project.server.controller;

import java.util.List;
import bit.project.server.entity.Paymentstatus;
import bit.project.server.dao.PaymentstatusDao;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@CrossOrigin
@RestController
@RequestMapping("/paymentstatuses")
public class PaymentstatusController{

    @Autowired
    private PaymentstatusDao paymentstatusDao;

    @GetMapping
    public List<Paymentstatus> getAll(){
        return paymentstatusDao.findAll();
    }
}