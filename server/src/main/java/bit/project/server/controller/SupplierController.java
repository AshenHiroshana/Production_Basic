package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Supplier;
import bit.project.server.dao.SupplierDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Supplierstatus;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping("/suppliers")
public class SupplierController{

    @Autowired
    private SupplierDao supplierDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public SupplierController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("supplier");
        codeConfig.setColumnName("code");
        codeConfig.setLength(8);
        codeConfig.setPrefix("SU");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Supplier> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all suppliers", UsecaseList.SHOW_ALL_SUPPLIERS);

        if(pageQuery.isEmptySearch()){
            return supplierDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");

        List<Supplier> suppliers = supplierDao.findAll(DEFAULT_SORT);
        Stream<Supplier> stream = suppliers.parallelStream();

        List<Supplier> filteredSuppliers = stream.filter(supplier -> {
            if(code!=null)
                if(!supplier.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!supplier.getName().toLowerCase().contains(name.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredSuppliers, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Supplier> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all suppliers' basic data", UsecaseList.SHOW_ALL_SUPPLIERS, UsecaseList.ADD_PORDER, UsecaseList.UPDATE_PORDER, UsecaseList.ADD_PURCHASE, UsecaseList.UPDATE_PURCHASE);
        return supplierDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Supplier get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get supplier", UsecaseList.SHOW_SUPPLIER_DETAILS);
        Optional<Supplier> optionalSupplier = supplierDao.findById(id);
        if(optionalSupplier.isEmpty()) throw new ObjectNotFoundException("Supplier not found");
        return optionalSupplier.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete suppliers", UsecaseList.DELETE_SUPPLIER);

        try{
            if(supplierDao.existsById(id)) supplierDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this supplier already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Supplier supplier, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new supplier", UsecaseList.ADD_SUPPLIER);

        supplier.setTocreation(LocalDateTime.now());
        supplier.setCreator(authUser);
        supplier.setId(null);
        supplier.setSupplierstatus(new Supplierstatus(1));;


        EntityValidator.validate(supplier);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(supplier.getEmail() != null){
            Supplier supplierByEmail = supplierDao.findByEmail(supplier.getEmail());
            if(supplierByEmail!=null) errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            supplier.setCode(codeGenerator.getNextId(codeConfig));
            return supplierDao.save(supplier);
        });

        return new ResourceLink(supplier.getId(), "/suppliers/"+supplier.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Supplier supplier, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update supplier details", UsecaseList.UPDATE_SUPPLIER);

        Optional<Supplier> optionalSupplier = supplierDao.findById(id);
        if(optionalSupplier.isEmpty()) throw new ObjectNotFoundException("Supplier not found");
        Supplier oldSupplier = optionalSupplier.get();

        supplier.setId(id);
        supplier.setCode(oldSupplier.getCode());
        supplier.setCreator(oldSupplier.getCreator());
        supplier.setTocreation(oldSupplier.getTocreation());


        EntityValidator.validate(supplier);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(supplier.getEmail() != null){
            Supplier supplierByEmail = supplierDao.findByEmail(supplier.getEmail());
            if(supplierByEmail!=null)
                if(!supplierByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        supplier = supplierDao.save(supplier);
        return new ResourceLink(supplier.getId(), "/suppliers/"+supplier.getId());
    }

}
