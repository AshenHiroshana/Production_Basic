package bit.project.server.dao;

import bit.project.server.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ClientDao extends JpaRepository<Client, Integer>{

    @Query("select new Client(c.id,c.code,c.name) from Client c")
    Page<Client> findAllBasic(PageRequest pageRequest);

    Client findByCode(String code);
    Client findByEmail(String email);

}
