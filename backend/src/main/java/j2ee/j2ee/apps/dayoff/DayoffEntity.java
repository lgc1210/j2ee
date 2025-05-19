package j2ee.j2ee.apps.dayoff;

import jakarta.persistence.*;
import lombok.Data;
import j2ee.j2ee.apps.store.StoreEntity;
import java.time.LocalDate;

@Entity
@Data
@Table(name = "holiday") 
public class DayoffEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String description;

    @ManyToOne
    @JoinColumn(name = "store_id")
    private StoreEntity store;
}