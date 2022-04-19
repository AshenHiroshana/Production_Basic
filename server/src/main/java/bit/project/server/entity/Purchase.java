package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import java.time.LocalDate;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Purchase{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDate date;

    private BigDecimal discount;

    private BigDecimal total;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Supplier supplier;

    @ManyToOne
    private Porder porder;

    @OneToMany(mappedBy="purchase", cascade = CascadeType.ALL)
    private List<Purchasematerial> purchasematerialList;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "purchase")
    private List<Supplierpayment> purchaseSupplierpaymentList;


    public Purchase(Integer id){
        this.id = id;
    }

    public Purchase(Integer id, String code, Supplier supplier){
        this.id = id;
        this.code = code;
        this.supplier = supplier;
    }

}
