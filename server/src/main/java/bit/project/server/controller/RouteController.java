package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.RouteDao;
import bit.project.server.entity.*;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.DataValidationException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.security.AccessControlManager;
import bit.project.server.util.validation.EntityValidator;
import bit.project.server.util.validation.ValidationErrorBag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.persistence.RollbackException;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping("/routes")
public class RouteController {
    @Autowired
    private RouteDao routeDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public RouteController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("route");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("RO");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page getAll(PageQuery pageQuery, HttpServletRequest request) {
       accessControlManager.authorize(request, "No privilege to get all routes", UsecaseList.SHOW_ALL_ROUTES);

        if(pageQuery.isEmptySearch()){
            return routeDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        Integer routestatusId = pageQuery.getSearchParamAsInteger("routestatus");
        Integer districtId = pageQuery.getSearchParamAsInteger("district");

        List<Route> routes = routeDao.findAll(DEFAULT_SORT);
        Stream<Route> stream = routes.parallelStream();

        List<Route> filteredRoutes = stream.filter(route -> {
            if(code!=null)
                if(!route.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!route.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(districtId!=null)
                if(!route.getDistrict().getId().equals(districtId)) return false;
            if(routestatusId!=null)
                if(!route.getRoutestatus().getId().equals(routestatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredRoutes, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Route> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        //accessControlManager.authorize(request, "No privilege to get all routes' basic data", UsecaseList.SHOW_ALL_ROUTES);
        return routeDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Route get(@PathVariable Integer id, HttpServletRequest request) {
        //accessControlManager.authorize(request, "No privilege to get route", UsecaseList.SHOW_ROUTE_DETAILS, UsecaseList.UPDATE_ROUTE);
        Optional<Route> optionalRoute = routeDao.findById(id);
        if(optionalRoute.isEmpty()) throw new ObjectNotFoundException("Route not found");
        return optionalRoute.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete routes", UsecaseList.DELETE_ROUTE);

        try{
            if(routeDao.existsById(id)) routeDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this route already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Route route, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new route", UsecaseList.ADD_ROUTE);

        route.setTocreation(LocalDateTime.now());
        route.setCreator(authUser);
        route.setId(null);
        route.setRoutestatus(new Routestatus(1));


        EntityValidator.validate(route);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(route.getName() != null){
            Route routeByName = routeDao.findByName(route.getName());
            if(routeByName!=null) errorBag.add("name","Name already exists");
        }
        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            route.setCode(codeGenerator.getNextId(codeConfig));
            return routeDao.save(route);
        });

        return new ResourceLink(route.getId(), "/routes/"+route.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Route route, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update route details", UsecaseList.UPDATE_ROUTE);

        Optional<Route> optionalRoute = routeDao.findById(id);
        if(optionalRoute.isEmpty()) throw new ObjectNotFoundException("Route not found");
        Route oldRoute = optionalRoute.get();

        route.setId(id);
        route.setCode(oldRoute.getCode());
        route.setCreator(oldRoute.getCreator());
        route.setTocreation(oldRoute.getTocreation());


        EntityValidator.validate(route);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(route.getName() != null){
            Route routeByName = routeDao.findByName(route.getName());
            if(routeByName!=null)
                if(!routeByName.getId().equals(id))
                    errorBag.add("name","name already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        route = routeDao.save(route);
        return new ResourceLink(route.getId(), "/routes/"+route.getId());
    }
}
