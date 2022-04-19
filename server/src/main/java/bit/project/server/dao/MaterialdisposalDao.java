package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Materialdisposal;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface MaterialdisposalDao extends JpaRepository<Materialdisposal, Integer>{
    @Query("select new Materialdisposal (m.id,m.code) from Materialdisposal m")
    Page<Materialdisposal> findAllBasic(PageRequest pageRequest);

    Materialdisposal findByCode(String code);
}