package bit.project.server.dao;

import bit.project.server.entity.Brand;
import bit.project.server.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface BrandDao extends JpaRepository<Brand, Integer>{

}
