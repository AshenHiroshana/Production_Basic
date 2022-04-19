package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.Paymentstatus;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.entity.Supplierpayment;
import bit.project.server.dao.SupplierpaymentDao;
import bit.project.server.util.helper.PageHelper;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/supplierpayments")
public class SupplierpaymentController{

    @Autowired
    private SupplierpaymentDao supplierpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SupplierpaymentController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("supplierpayment");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("SP");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Supplierpayment> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all supplierpayments", UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);

        if(pageQuery.isEmptySearch()){
            return supplierpaymentDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer purchaseId = pageQuery.getSearchParamAsInteger("purchase");
        Integer paymentstatusId = pageQuery.getSearchParamAsInteger("paymentstatus");

        List<Supplierpayment> supplierpayments = supplierpaymentDao.findAll(DEFAULT_SORT);
        Stream<Supplierpayment> stream = supplierpayments.parallelStream();

        List<Supplierpayment> filteredSupplierpayments = stream.filter(supplierpayment -> {
            if(code!=null)
                if(!supplierpayment.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(purchaseId!=null)
                if(!supplierpayment.getPurchase().getId().equals(purchaseId)) return false;
            if(paymentstatusId!=null)
                if(!supplierpayment.getPaymentstatus().getId().equals(paymentstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSupplierpayments, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Supplierpayment> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all supplierpayments' basic data", UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
        return supplierpaymentDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Supplierpayment get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get supplierpayment", UsecaseList.SHOW_SUPPLIERPAYMENT_DETAILS);
        Optional<Supplierpayment> optionalSupplierpayment = supplierpaymentDao.findById(id);
        if(optionalSupplierpayment.isEmpty()) throw new ObjectNotFoundException("Supplierpayment not found");
        return optionalSupplierpayment.get();
    }

    @GetMapping("/basic/{id}")
    public Supplierpayment getByPurchaseID(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get supplierpayment", UsecaseList.SHOW_ALL_SUPPLIERPAYMENTS);
        Supplierpayment optionalSupplierpayment = supplierpaymentDao.findByPurchase(id);
        if(optionalSupplierpayment == null) throw new ObjectNotFoundException("Supplierpayment not found");
        return optionalSupplierpayment;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete supplierpayments", UsecaseList.DELETE_SUPPLIERPAYMENT);

        try{
            if(supplierpaymentDao.existsById(id)) supplierpaymentDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this supplierpayment already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Supplierpayment supplierpayment, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new supplierpayment", UsecaseList.ADD_SUPPLIERPAYMENT);

        supplierpayment.setTocreation(LocalDateTime.now());
        supplierpayment.setCreator(authUser);
        supplierpayment.setId(null);


        EntityValidator.validate(supplierpayment);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(supplierpayment.getChequeno() != null){
            Supplierpayment supplierpaymentByChequeno = supplierpaymentDao.findByChequeno(supplierpayment.getChequeno());
            if(supplierpaymentByChequeno!=null) errorBag.add("chequeno","chequeno already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            supplierpayment.setCode(codeGenerator.getNextId(codeConfig));
            return supplierpaymentDao.save(supplierpayment);
        });

        return new ResourceLink(supplierpayment.getId(), "/supplierpayments/"+supplierpayment.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Supplierpayment supplierpayment, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update supplierpayment details", UsecaseList.UPDATE_SUPPLIERPAYMENT);

        Optional<Supplierpayment> optionalSupplierpayment = supplierpaymentDao.findById(id);
        if(optionalSupplierpayment.isEmpty()) throw new ObjectNotFoundException("Supplierpayment not found");
        Supplierpayment oldSupplierpayment = optionalSupplierpayment.get();

        supplierpayment.setId(id);
        supplierpayment.setCode(oldSupplierpayment.getCode());
        supplierpayment.setCreator(oldSupplierpayment.getCreator());
        supplierpayment.setTocreation(oldSupplierpayment.getTocreation());


        EntityValidator.validate(supplierpayment);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(supplierpayment.getChequeno() != null){
            Supplierpayment supplierpaymentByChequeno = supplierpaymentDao.findByChequeno(supplierpayment.getChequeno());
            if(supplierpaymentByChequeno!=null)
                if(!supplierpaymentByChequeno.getId().equals(id))
                    errorBag.add("chequeno","chequeno already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        supplierpayment = supplierpaymentDao.save(supplierpayment);
        return new ResourceLink(supplierpayment.getId(), "/supplierpayments/"+supplierpayment.getId());
    }

}
