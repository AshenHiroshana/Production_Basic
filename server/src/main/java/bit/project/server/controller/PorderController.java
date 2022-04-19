package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import bit.project.server.entity.Porder;
import bit.project.server.dao.PorderDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.entity.Porderstatus;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.entity.Pordermaterial;
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
@RequestMapping("/porders")
public class PorderController{

    @Autowired
    private PorderDao porderDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PorderController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("porder");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("PO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Porder> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all porders", UsecaseList.SHOW_ALL_PORDERS);

        if(pageQuery.isEmptySearch()){
            return porderDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer supplierId = pageQuery.getSearchParamAsInteger("supplier");

        List<Porder> porders = porderDao.findAll(DEFAULT_SORT);
        Stream<Porder> stream = porders.parallelStream();

        List<Porder> filteredPorders = stream.filter(porder -> {
            if(code!=null)
                if(!porder.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(supplierId!=null)
                if(!porder.getSupplier().getId().equals(supplierId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPorders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/status")
    public Page<Porder> getAllByStatus(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all porders", UsecaseList.SHOW_ALL_PORDERS, UsecaseList.ADD_PURCHASE, UsecaseList.UPDATE_PURCHASE);

        List<Porder> porders = porderDao.findAll(DEFAULT_SORT);
        Stream<Porder> stream = porders.parallelStream();

        List<Porder> filteredPorders = stream.filter(porder -> {
            if(porder.getPorderstatus().getId().equals(2))
                return false;
            if(porder.getPorderstatus().getId().equals(3))
                return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPorders, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Porder> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all porders' basic data", UsecaseList.SHOW_ALL_PORDERS, UsecaseList.ADD_PURCHASE, UsecaseList.UPDATE_PURCHASE);
        return porderDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Porder get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get porder", UsecaseList.SHOW_PORDER_DETAILS);
        Optional<Porder> optionalPorder = porderDao.findById(id);
        if(optionalPorder.isEmpty()) throw new ObjectNotFoundException("Porder not found");
        return optionalPorder.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete porders", UsecaseList.DELETE_PORDER);

        try{
            if(porderDao.existsById(id)) porderDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this porder already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Porder porder, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new porder", UsecaseList.ADD_PORDER);

        porder.setTocreation(LocalDateTime.now());
        porder.setCreator(authUser);
        porder.setId(null);
        porder.setPorderstatus(new Porderstatus(1));

        for(Pordermaterial pordermaterial : porder.getPordermaterialList()) pordermaterial.setPorder(porder);

        EntityValidator.validate(porder);

        PersistHelper.save(()->{
            porder.setCode(codeGenerator.getNextId(codeConfig));
            return porderDao.save(porder);
        });

        return new ResourceLink(porder.getId(), "/porders/"+porder.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Porder porder, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update porder details", UsecaseList.UPDATE_PORDER);

        Optional<Porder> optionalPorder = porderDao.findById(id);
        if(optionalPorder.isEmpty()) throw new ObjectNotFoundException("Porder not found");
        Porder oldPorder = optionalPorder.get();

        porder.setId(id);
        porder.setCode(oldPorder.getCode());
        porder.setCreator(oldPorder.getCreator());
        porder.setTocreation(oldPorder.getTocreation());

        for(Pordermaterial pordermaterial : porder.getPordermaterialList()) pordermaterial.setPorder(porder);

        EntityValidator.validate(porder);

        porder = porderDao.save(porder);
        return new ResourceLink(porder.getId(), "/porders/"+porder.getId());
    }

}
