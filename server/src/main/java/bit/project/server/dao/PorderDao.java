package bit.project.server.dao;

import bit.project.server.entity.Porder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface PorderDao extends JpaRepository<Porder, Integer>{
    @Query("select new Porder (p.id,p.code,p.doordered,p.dorequired,p.supplier) from Porder p")
    Page<Porder> findAllBasic(PageRequest pageRequest);

    Porder findByCode(String code);
}
