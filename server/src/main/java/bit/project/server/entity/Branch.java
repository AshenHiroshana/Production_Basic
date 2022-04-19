package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;


@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    private  String name;

    private String tel1;

    private String tel2;

    @Lob
    private String address;

    private String email;

    private String fax;

    @ManyToOne
    private Branchtype branchtype;

    @ManyToOne
    private Branchstatus branchstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    public Branch(Integer id) {
        this.id = id;
    }

    public Branch(Integer id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }
}
