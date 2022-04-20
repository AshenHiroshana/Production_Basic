package bit.project.server.controller;

import bit.project.server.UsecaseList;
import bit.project.server.dao.TrainingsessionDao;
import bit.project.server.entity.Trainingsession;
import bit.project.server.entity.Trainingsessionstatus;
import bit.project.server.entity.User;
import bit.project.server.util.dto.PageQuery;
import bit.project.server.util.dto.ResourceLink;
import bit.project.server.util.exception.ConflictException;
import bit.project.server.util.exception.ObjectNotFoundException;
import bit.project.server.util.helper.CodeGenerator;
import bit.project.server.util.helper.PageHelper;
import bit.project.server.util.helper.PersistHelper;
import bit.project.server.util.security.AccessControlManager;
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
@RequestMapping("/trainingsessions")
public class TrainingsessionController {

    @Autowired
    private TrainingsessionDao trainingsessionDao;

    @Autowired
    private AccessControlManager accessControlManager;

    @Autowired
    private CodeGenerator codeGenerator;

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "tocreation");
    private final CodeGenerator.CodeGeneratorConfig codeConfig;

    public TrainingsessionController() {
        codeConfig = new CodeGenerator.CodeGeneratorConfig("trainingsession");
        codeConfig.setColumnName("code");
        codeConfig.setLength(10);
        codeConfig.setPrefix("TS");
        codeConfig.setYearlyRenew(true);
    }

    @GetMapping
    public Page getAll(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all trainingsessions", UsecaseList.SHOW_ALL_TRAININGSESSIONS);

        if (pageQuery.isEmptySearch()) {
            return trainingsessionDao.findAll(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
        }

        String code = pageQuery.getSearchParam("code");
        String date = pageQuery.getSearchParam("date");
        Integer customerId = pageQuery.getSearchParamAsInteger("customer");
        Integer trainingsessionstatusId = pageQuery.getSearchParamAsInteger("trainingsessionstatus");

        List<Trainingsession> trainingsessions = trainingsessionDao.findAll(DEFAULT_SORT);
        Stream<Trainingsession> stream = trainingsessions.parallelStream();

        List<Trainingsession> filteredTrainingsessions = stream.filter(trainingsession -> {
            if (code != null)
                if (!trainingsession.getCode().toLowerCase().contains(code.toLowerCase())) return false;
            if (date != null)
                if (!trainingsession.getDate().toString().toLowerCase().contains(date.toLowerCase())) return false;
            if (customerId != null)
                if (!trainingsession.getClient().getId().equals(customerId)) return false;
            if (trainingsessionstatusId != null)
                if (!trainingsession.getTrainingsessionstatus().getId().equals(trainingsessionstatusId)) return false;
            return true;
        }).collect(Collectors.toList());

        return PageHelper.getAsPage(filteredTrainingsessions, pageQuery.getPage(), pageQuery.getSize());
    }

    @GetMapping("/basic")
    public Page<Trainingsession> getAllBasic(PageQuery pageQuery, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get all trainingsessions' basic data", UsecaseList.SHOW_ALL_TRAININGSESSIONS);
        return trainingsessionDao.findAllBasic(PageRequest.of(pageQuery.getPage(), pageQuery.getSize(), DEFAULT_SORT));
    }

    @GetMapping("/{id}")
    public Trainingsession get(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to get trainingsession", UsecaseList.SHOW_TRAININGSESSION_DETAILS, UsecaseList.UPDATE_TRAININGSESSION);
        Optional<Trainingsession> optionalTrainingsession = trainingsessionDao.findById(id);
        if (optionalTrainingsession.isEmpty()) throw new ObjectNotFoundException("Trainingsession not found");
        return optionalTrainingsession.get();
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to delete trainingsessions", UsecaseList.DELETE_TRAININGSESSION);

        try {
            if (trainingsessionDao.existsById(id)) trainingsessionDao.deleteById(id);
        } catch (DataIntegrityViolationException | RollbackException e) {
            throw new ConflictException("Cannot delete. Because this trainingsession already used in another module");
        }
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResourceLink add(@RequestBody Trainingsession trainingsession, HttpServletRequest request) throws InterruptedException {
        User authUser = accessControlManager.authorize(request, "No privilege to add new trainingsession", UsecaseList.ADD_TRAININGSESSION);

        trainingsession.setTocreation(LocalDateTime.now());
        trainingsession.setCreator(authUser);
        trainingsession.setId(null);
        trainingsession.setTrainingsessionstatus(new Trainingsessionstatus(1));

        PersistHelper.save(() -> {
            trainingsession.setCode(codeGenerator.getNextId(codeConfig));
            return trainingsessionDao.save(trainingsession);
        });

        return new ResourceLink(trainingsession.getId(), "/trainingsessions/" + trainingsession.getId());
    }

    @PutMapping("/{id}")
    public ResourceLink update(@PathVariable Integer id, @RequestBody Trainingsession trainingsession, HttpServletRequest request) {
        accessControlManager.authorize(request, "No privilege to update trainingsession details", UsecaseList.UPDATE_TRAININGSESSION);

        Optional<Trainingsession> optionalTrainingsession = trainingsessionDao.findById(id);
        if (optionalTrainingsession.isEmpty()) throw new ObjectNotFoundException("Trainingsession not found");
        Trainingsession oldTrainingsession = optionalTrainingsession.get();

        trainingsession.setId(id);
        trainingsession.setCode(oldTrainingsession.getCode());
        trainingsession.setCreator(oldTrainingsession.getCreator());
        trainingsession.setTocreation(oldTrainingsession.getTocreation());

        trainingsession = trainingsessionDao.save(trainingsession);
        return new ResourceLink(trainingsession.getId(), "/trainingsessions/" + trainingsession.getId());
    }
}


