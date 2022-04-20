package bit.project.server.dao;

import bit.project.server.entity.Trainingsession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface TrainingsessionstatusDao extends JpaRepository<Trainingsession, Integer> {
}
