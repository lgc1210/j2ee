package j2ee.j2ee.apps.category;

import j2ee.j2ee.apps.store.StoreEntity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.Data;

@Entity(name = "categories")
@Data
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private LocalDateTime created_at;

    private LocalDateTime updated_at;

    private LocalDateTime deleted_at;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", referencedColumnName = "id", nullable = false)
    private StoreEntity store;

    @PrePersist
    protected void onCreate() {
        created_at = LocalDateTime.now();
        updated_at = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updated_at = LocalDateTime.now();
    }
}
