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

public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    private String name;

    private Integer timegap;

    @ManyToOne
    @JsonIgnoreProperties({"creator", "status", "tocreation", "rolelist"})
    private User creator;

    @ManyToOne
    private District district;

    @ManyToOne
    private Vehicle vehicle;

    @ManyToOne
    //@JsonIgnoreProperties({"creator", "callingname", "nic", "mobile"})
    private Employee ref;

    @ManyToOne
    private Routestatus routestatus;

    @JsonIgnore
    @OneToMany(mappedBy = "route")
    private List<Client> clientList;

    public Route(Integer id) {
        this.id = id;
    }

    public Route(Integer id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }
}
