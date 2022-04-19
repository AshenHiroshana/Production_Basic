package bit.project.server.controller;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.stream.Stream;
import java.util.stream.Collectors;
import bit.project.server.UsecaseList;
import bit.project.server.dao.PorderDao;
import bit.project.server.dao.SupplierpaymentDao;
import bit.project.server.entity.*;
import bit.project.server.dao.PurchaseDao;
import org.springframework.http.HttpStatus;
import javax.persistence.RollbackException;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Page;
import javax.servlet.http.HttpServletRequest;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
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
@RequestMapping("/purchases")
public class PurchaseController{

    @Autowired
    private PurchaseDao purchaseDao;

    @Autowired
    private PorderDao porderDao;

    @Autowired
    private SupplierpaymentDao supplierpaymentDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public PurchaseController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("purchase");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("PU");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Purchase> getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all purchases", UsecaseList.SHOW_ALL_PURCHASES);

        if(pageQuery.isEmptySearch()){
            return purchaseDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        Integer porderId = pageQuery.getSearchParamAsInteger("porder");

        List<Purchase> purchases = purchaseDao.findAll(DEFAULT_SORT);
        Stream<Purchase> stream = purchases.parallelStream();

        List<Purchase> filteredPurchases = stream.filter(purchase -> {
            if(code!=null)
                if(!purchase.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(porderId!=null)
                if(!purchase.getPorder().getId().equals(porderId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPurchases, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Purchase> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all purchases' basic data", UsecaseList.SHOW_ALL_PURCHASES, UsecaseList.ADD_SUPPLIERPAYMENT, UsecaseList.UPDATE_SUPPLIERPAYMENT);
        return purchaseDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Purchase get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get purchase", UsecaseList.SHOW_PURCHASE_DETAILS);
        Optional<Purchase> optionalPurchase = purchaseDao.findById(id);
        if(optionalPurchase.isEmpty()) throw new ObjectNotFoundException("Purchase not found");
        return optionalPurchase.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete purchases", UsecaseList.DELETE_PURCHASE);

        try{
            if(purchaseDao.existsById(id)) {
                Optional<Purchase> optionalPurchase = purchaseDao.findById(id);
                Purchase purchase = optionalPurchase.get();
                if (purchase.getPorder() != null){
                    Porder porder = porderDao.findByCode(purchase.getPorder().getCode());
                    porder.setPorderstatus(new Porderstatus(1));
                    porderDao.save(porder);
                }

                purchaseDao.deleteById(id);

            }

        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this purchase already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Purchase purchase, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new purchase", UsecaseList.ADD_PURCHASE);

        purchase.setTocreation(LocalDateTime.now());
        purchase.setCreator(authUser);
        purchase.setId(null);

        for(Purchasematerial purchasematerial : purchase.getPurchasematerialList()) purchasematerial.setPurchase(purchase);

        EntityValidator.validate(purchase);

        PersistHelper.save(()->{
            purchase.setCode(codeGenerator.getNextId(codeConfig));
            return purchaseDao.save(purchase);
        });

        if (purchase.getPorder() != null){
            Porder porder = porderDao.findByCode(purchase.getPorder().getCode());
            porder.setPorderstatus(new Porderstatus(2));
            porderDao.save(porder);
        }

        return new ResourceLink(purchase.getId(), "/purchases/"+purchase.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Purchase purchase, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update purchase details", UsecaseList.UPDATE_PURCHASE);

        Optional<Purchase> optionalPurchase = purchaseDao.findById(id);
        if(optionalPurchase.isEmpty()) throw new ObjectNotFoundException("Purchase not found");
        Purchase oldPurchase = optionalPurchase.get();

        purchase.setId(id);
        purchase.setCode(oldPurchase.getCode());
        purchase.setCreator(oldPurchase.getCreator());
        purchase.setTocreation(oldPurchase.getTocreation());

        for(Purchasematerial purchasematerial : purchase.getPurchasematerialList()) purchasematerial.setPurchase(purchase);

        EntityValidator.validate(purchase);

        purchase = purchaseDao.save(purchase);
        return new ResourceLink(purchase.getId(), "/purchases/"+purchase.getId());
    }

    @GetMapping("/unpaid")
    public Page<Purchase> getUnpaidAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all purchases", UsecaseList.SHOW_ALL_PURCHASES);

        List<Purchase> purchases = purchaseDao.findAll(DEFAULT_SORT);
        Stream<Purchase> stream = purchases.parallelStream();

        List<Purchase> filteredPurchases = stream.filter(purchase -> {
            if(!purchase.getPurchaseSupplierpaymentList().isEmpty()){

                System.out.println(purchase.getCode());
                System.out.println(purchase.getPurchaseSupplierpaymentList().size());
                if(purchase.getPurchaseSupplierpaymentList().get(0).getPaymentstatus().getId().equals(1)) return false;

            }
                return true;

        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredPurchases, pageQuery.getPage(), pageQuery.getSize());

    }

}
