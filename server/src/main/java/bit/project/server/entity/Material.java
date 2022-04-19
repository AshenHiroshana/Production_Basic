package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Material {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal qty;

    private BigDecimal lastpurchaseprice;

    private BigDecimal rop;

    private LocalDateTime tocreation;


    @ManyToOne
    private Materialtype materialtype;

    @ManyToOne
    private Brand brand;

    @ManyToOne
    private Unit unit;

    @ManyToOne
    private Materialstatus materialstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Materialdisposalmaterial> materialdisposalmaterialList;

    //    @JsonIgnore
    @OneToMany(mappedBy = "material")
    @JsonIgnoreProperties({"porder","material"})
    private List<Pordermaterial> pordermaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Purchasematerial> purchasematerialList;


    @ManyToMany(mappedBy = "materialList")
    @JsonIgnoreProperties({"suppliertype","supplierstatus","creator","supplierPorderList","supplierPurchaseList","supplierSupplierreturnList","materialList"})
    private List<Supplier> supplierList;

    public Material(Integer id){
        this.id = id;
    }

    public Material(Integer id, String code, String name, Brand brand){
        this.id = id;
        this.code = code;
        this.name = name;
        this.brand = brand;
    }

}
