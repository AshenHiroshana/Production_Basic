package bit.project.server.dao;

import bit.project.server.entity.Designation;
import bit.project.server.entity.Employee;
import bit.project.server.entity.Nametitle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface EmployeeDao extends JpaRepository<Employee, Integer>{
    @Query("select new Employee (e.id,e.code,e.nametitle,e.callingname,e.photo) from Employee e")
    Page<Employee> findAllBasic(PageRequest pageRequest);

    @Query("select new Employee (e.id,e.code,e.nametitle,e.callingname,e.photo) from Employee e where e.designation.id = 3 and e.employeestatus.id = 1 " )
    Page<Employee> findAllByDesignationAndeAndEmployeestatus(PageRequest pageRequest);

    Employee findByCode(String code);
    Employee findByNic(String nic);
    Employee findByMobile(String mobile);
    Employee findByEmail(String email);

}
