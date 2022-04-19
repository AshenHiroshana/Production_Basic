package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.ClientDao;
import bit.project.server.entity.Client;
import bit.project.server.entity.Clientstatus;
import bit.project.server.entity.Supplierstatus;
import bit.project.server.entity.User;
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
@RequestMapping("/clients")
public class ClientController {
    @Autowired
    private ClientDao clientDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public ClientController(){
        codeConfig = new CodeGenerator.CodeGeneratorConfig("client");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("CL");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page<Client> getAll(PageQuery pageQuery, HttpServletRequest request) {
        //accessControlManager.authorize(request, "No privilege to get all clients", UsecaseList.SHOW_ALL_CLIENTS);

        if(pageQuery.isEmptySearch()){
            return clientDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String name = pageQuery.getSearchParam("name");
        String contact1 = pageQuery.getSearchParam("contact1");
        String email = pageQuery.getSearchParam("email");

        List<Client> clients = clientDao.findAll(DEFAULT_SORT);
        Stream<Client> stream = clients.parallelStream();

        List<Client> filteredClients = stream.filter(client -> {
            if(code!=null)
                if(!client.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if(name!=null)
                if(!client.getName().toLowerCase().contains(name.toLowerCase())) return false;
            if(contact1!=null)
                if(!client.getContact1().toLowerCase().contains(contact1.toLowerCase())) return false;
            if(contact1!=null)
                if(!client.getEmail().toLowerCase().contains(email.toLowerCase())) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredClients, pageQuery.getPage(), pageQuery.getSize());

    }

    @GetMapping("/basic")
    public Page<Client> getAllBasic(PageQuery pageQuery, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to get all clients' basic data", UsecaseList.SHOW_ALL_CLIENTS);
        return clientDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Client get(@PathVariable Integer id, HttpServletRequest request) {
        //accessControlManager.authorize(request, "No privilege to get client", UsecaseList.SHOW_CLIENT_DETAILS, UsecaseList.UPDATE_CLIENT);
        Optional<Client> optionalClient = clientDao.findById(id);
        if(optionalClient.isEmpty()) throw new ObjectNotFoundException("Client not found");
        return optionalClient.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request){
        accessControlManager.authorize(request, "No privilege to delete clients", UsecaseList.DELETE_CLIENT);

        try{
            if(clientDao.existsById(id)) clientDao.deleteById(id);
        }catch (DataIntegrityViolationException | RollbackException e){
            throw new ConflictException("Cannot delete. Because this client already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Client client, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new client", UsecaseList.ADD_CLIENT);

        client.setTocreation(LocalDateTime.now());
        client.setCreator(authUser);
        client.setId(null);
        client.setClientstatus(new Clientstatus(1));

        EntityValidator.validate(client);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(client.getEmail() != null){
            Client clientByEmail = clientDao.findByEmail(client.getEmail());
            if(clientByEmail != null) errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        PersistHelper.save(()->{
            client.setCode(codeGenerator.getNextId(codeConfig));
            return clientDao.save(client);
        });

        return new ResourceLink(client.getId(), "/clients/"+client.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Client client, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update client details", UsecaseList.UPDATE_CLIENT);

        Optional<Client> optionalClient = clientDao.findById(id);
        if(optionalClient.isEmpty()) throw new ObjectNotFoundException("Client not found");
        Client oldClient = optionalClient.get();

        client.setId(id);
        client.setCode(oldClient.getCode());
        client.setCreator(oldClient.getCreator());
        client.setTocreation(oldClient.getTocreation());


        EntityValidator.validate(client);

        ValidationErrorBag errorBag = new ValidationErrorBag();

        if(client.getEmail() != null){
            Client clientByEmail = clientDao.findByEmail(client.getEmail());
            if(clientByEmail!=null)
                if(!clientByEmail.getId().equals(id))
                    errorBag.add("email","email already exists");
        }

        if(errorBag.count()>0) throw new DataValidationException(errorBag);

        client = clientDao.save(client);
        return new ResourceLink(client.getId(), "/clients/"+client.getId());
    }
}
