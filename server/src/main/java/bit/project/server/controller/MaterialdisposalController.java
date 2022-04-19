package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.entity.User;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import org.springframework.web.bind.annotation.*;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.entity.Materialdisposal;
import bit.project.server.dao.MaterialdisposalDao;
import org.springframework.data.domain.PageRequest;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.entity.Materialdisposalmaterial;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.validation.ValidationErrorBag;
import bit.project.server.util.security.AccessControlManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;

@CrossOrigin
@RestController
@RequestMapping("/materialdisposals")
public class MaterialdisposalController{

    @Autowired
    private MaterialdisposalDao materialdisposalDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public MaterialdisposalController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("materialdisposal");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("MD");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Materialdisposal> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all materialdisposals", UsecaseList.SHOW_ALL_MATERIALDISPOSALS);

        if(pageQuery.isEmptySearch()){
            return materialdisposalDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");

        List<Materialdisposal> materialdisposals = materialdisposalDao.findAll(DEFAULT_SORT);
        Stream<Materialdisposal> stream = materialdisposals.parallelStream();

        List<Materialdisposal> filteredMaterialdisposals = stream.filter(materialdisposal -> {
            if(code!=null)
                if(!materialdisposal.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredMaterialdisposals, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Materialdisposal> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all materialdisposals' basic data", UsecaseList.SHOW_ALL_MATERIALDISPOSALS);
        return materialdisposalDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Materialdisposal get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get materialdisposal", UsecaseList.SHOW_MATERIALDISPOSAL_DETAILS);
        Optional<Materialdisposal> optionalMaterialdisposal = materialdisposalDao.findById(id);
        if(optionalMaterialdisposal.isEmpty()) throw new ObjectNotFoundException("Materialdisposal not found");
        return optionalMaterialdisposal.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete materialdisposals", UsecaseList.DELETE_MATERIALDISPOSAL);

        try{
            if(materialdisposalDao.existsById(id)) materialdisposalDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this materialdisposal already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Materialdisposal materialdisposal, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new materialdisposal", UsecaseList.ADD_MATERIALDISPOSAL);

        materialdisposal.setTocreation(LocalDateTime.now());
        materialdisposal.setCreator(authUser);
        materialdisposal.setId(null);

        for(Materialdisposalmaterial materialdisposalmaterial : materialdisposal.getMaterialdisposalmaterialList()) materialdisposalmaterial.setMaterialdisposal(materialdisposal);

        EntityValidator.validate(materialdisposal);

        PersistHelper.save(()->{
            materialdisposal.setCode(codeGenerator.getNextId(codeConfig));
            return materialdisposalDao.save(materialdisposal);
        });

        return new ResourceLink(materialdisposal.getId(), "/materialdisposals/"+materialdisposal.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Materialdisposal materialdisposal, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update materialdisposal details", UsecaseList.UPDATE_MATERIALDISPOSAL);

        Optional<Materialdisposal> optionalMaterialdisposal = materialdisposalDao.findById(id);
        if(optionalMaterialdisposal.isEmpty()) throw new ObjectNotFoundException("Materialdisposal not found");
        Materialdisposal oldMaterialdisposal = optionalMaterialdisposal.get();

        materialdisposal.setId(id);
        materialdisposal.setCode(oldMaterialdisposal.getCode());
        materialdisposal.setCreator(oldMaterialdisposal.getCreator());
        materialdisposal.setTocreation(oldMaterialdisposal.getTocreation());

        for(Materialdisposalmaterial materialdisposalmaterial : materialdisposal.getMaterialdisposalmaterialList()) materialdisposalmaterial.setMaterialdisposal(materialdisposal);

        EntityValidator.validate(materialdisposal);

        materialdisposal = materialdisposalDao.save(materialdisposal);
        return new ResourceLink(materialdisposal.getId(), "/materialdisposals/"+materialdisposal.getId());
    }

}