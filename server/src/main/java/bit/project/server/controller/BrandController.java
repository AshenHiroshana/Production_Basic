package bit.project.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import bit.project.server.dao.MaterialDao;
import bit.project.server.entity.Brand;
import bit.project.server.dao.BrandDao;
import bit.project.server.entity.Material;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin
@RestController
@RequestMapping("/brands")
public class BrandController{

    @Autowired
    private BrandDao brandDao;

    @Autowired
    private MaterialDao materialDao;

    @GetMapping
    public List<Brand> getAll(){
        return brandDao.findAll();
    }


    @GetMapping("/material/{name}")
    public List<Brand> getAllByMaterial(@PathVariable String name, HttpServletRequest request){

        List<Brand> brands = brandDao.findAll();
        ArrayList<Brand> brandsByMaterial = new ArrayList<Brand>();
        List<Material> materials = materialDao.findAllByName(name);
        materials.forEach(material -> {
            brandsByMaterial.add(material.getBrand());
        });

        brands.removeAll(brandsByMaterial);
        return brands;
    }

    @GetMapping("/materialWithThis/{id}/{name}")
    public List<Brand> getAllByMaterialWithThis(@PathVariable String name, HttpServletRequest request, @PathVariable Integer id){

        List<Brand> brands = brandDao.findAll();
        ArrayList<Brand> brandsByMaterial = new ArrayList<Brand>();
        List<Material> materials = materialDao.findAllByName(name);
        materials.forEach(material -> {
            brandsByMaterial.add(material.getBrand());
        });

        brands.removeAll(brandsByMaterial);
        Optional<Material> thisMaterial = materialDao.findById(id);
        brands.add(thisMaterial.get().getBrand());
        return brands;
    }

}
