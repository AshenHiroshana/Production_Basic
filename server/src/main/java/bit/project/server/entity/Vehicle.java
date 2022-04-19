package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String no;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    private String photo;

    private String brand;

    private String model;

    @ManyToOne
    @JsonIgnoreProperties({"creator", "status", "tocreation", "rolelist"})
    private User creator;

    @ManyToOne
    private Vehicletype vehicletype;

    @ManyToOne
    private Vehiclestatus vehiclestatus;

    @JsonIgnore
    @OneToMany(mappedBy = "vehicle")
    private List<Route> routeList;

    public Vehicle(Integer id) {
        this.id = id;
    }

    public Vehicle(Integer id, String no, String brand) {
        this.id = id;
        this.no = no;
        this.brand = brand;
    }
}
