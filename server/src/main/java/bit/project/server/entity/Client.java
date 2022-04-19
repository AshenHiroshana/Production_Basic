package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    private String name;

    private String contact1;

    private String contact2;

    @Lob
    private String address;

    private String email;

    private String fax;

    @ManyToOne
    @JsonIgnoreProperties({"creator", "status", "tocreation", "rolelist"})
    private User creator;


    @ManyToOne
    private Clientstatus clientstatus;

    public Client(Integer id) {
        this.id = id;
    }

    public Client(Integer id, String code, String name) {
        this.id = id;
        this.code = code;
        this.name = name;
    }
}
