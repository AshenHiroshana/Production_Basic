package bit.project.server.dao;

import bit.project.server.entity.Clientstatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface ClientstatusDao extends JpaRepository<Clientstatus, Integer>{
}
