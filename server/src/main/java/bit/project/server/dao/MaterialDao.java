package bit.project.server.dao;

import bit.project.server.entity.Brand;
import bit.project.server.entity.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(exported=false)
public interface MaterialDao extends JpaRepository<Material, Integer>{
    @Query("select new Material (m.id,m.code,m.name,m.brand) from Material m")
    Page<Material> findAllBasic(PageRequest pageRequest);

    List<Material> findAllByName(String name);

    Material findByCode(String code);
    Material findByName(String name);
    Material findByBrand(Brand brand);
}
