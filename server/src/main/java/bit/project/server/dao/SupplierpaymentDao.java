package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Supplierpayment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;

@RepositoryRestResource(exported=false)
public interface SupplierpaymentDao extends JpaRepository<Supplierpayment, Integer>{
    @Query("select new Supplierpayment (s.id,s.code) from Supplierpayment s")
    Page<Supplierpayment> findAllBasic(PageRequest pageRequest);

//    @Query("select s.purchase from Supplierpayment s where s.purchase=:purchase")
//    Long getPrchase(@Param("purchase") Integer purchase);

    Supplierpayment findByCode(String code);
    Supplierpayment findByChequeno(String chequeno);
    Supplierpayment findByPurchase(Integer purchase);
}
