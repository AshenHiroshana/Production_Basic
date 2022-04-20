package bit.project.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Trainingsession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private LocalDateTime tocreation;

    @Lob
    private String description;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;

    @ManyToOne
    private Client client;

    private LocalDate date;

    private LocalTime stime;

    private LocalTime etime;

    private String venue;

    @ManyToOne
    private Trainingsessionstatus trainingsessionstatus;

    @ManyToMany
    @JoinTable(
            name = "trainingsessionemployee",
            joinColumns = @JoinColumn(name = "trainingsession_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id", referencedColumnName = "id")
    )
    private List<Employee> employeeList;

    public Trainingsession(Integer id) {
        this.id = id;
    }

    public Trainingsession(Integer id, String code, Client client, LocalDate date, Trainingsessionstatus trainingsessionstatus) {
        this.id = id;
        this.code = code;
        this.client = client;
        this.date = date;
        this.trainingsessionstatus = trainingsessionstatus;
    }
}
