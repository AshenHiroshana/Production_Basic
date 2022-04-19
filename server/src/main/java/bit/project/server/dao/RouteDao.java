package bit.project.server.dao;

import bit.project.server.entity.Route;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface RouteDao extends JpaRepository<Route, Integer>{
    Route findByCode(String code);
    Route findByName(String name);

    @Query("select new Route (r.id,r.code,r.name) from Route r")
    Page<Route> findAllBasic(PageRequest pageRequest);
}
