package j2ee.j2ee.apps.discount;

import jakarta.persistence.*;
import lombok.Data;
import j2ee.j2ee.apps.store.StoreEntity;

@Entity
@Data
@Table(name = "discounts")
public class DiscountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private StoreEntity store;

    @Column(nullable = false, unique = true)
    private String code;

    @Column
    private String description;

    @Column(nullable = false)
    private Float value;
}