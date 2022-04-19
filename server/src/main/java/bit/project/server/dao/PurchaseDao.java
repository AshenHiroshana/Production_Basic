package bit.project.server.dao;

import bit.project.server.entity.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.time.LocalDate;

@RepositoryRestResource(exported=false)
public interface PurchaseDao extends JpaRepository<Purchase, Integer>{
    @Query("select new Purchase (p.id,p.code,p.supplier) from Purchase p")
    Page<Purchase> findAllBasic(PageRequest pageRequest);

    Purchase findByCode(String code);

    @Query("select count(p) from Purchase p where p.date>=:startdate and p.date<=:enddate")
    Long getPurchaseCountByRange(@Param("startdate")LocalDate startdate, @Param("enddate")LocalDate enddate);
}
