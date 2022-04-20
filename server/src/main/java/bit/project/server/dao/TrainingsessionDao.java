package bit.project.server.dao;

import bit.project.server.entity.Trainingsession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface TrainingsessionDao extends JpaRepository<Trainingsession, Integer>{

    @Query("select new Trainingsession (t.id, t.code, t.client, t.date, t.trainingsessionstatus) from Trainingsession t")
    Page<Trainingsession> findAllBasic(PageRequest pageRequest);

    Trainingsession findByCode(String code);
}

