package j2ee.j2ee.apps.category_of_service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Base64;

@Entity(name = "categories_of_services")
@Data
public class CategoryOfServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] image;

    @Transient // Not stored in database
    private String imageBase64;

    // Getter to convert byte[] to Base64
    public String getImageBase64() {
        if (image != null) {
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(image);
        }
        return null;
    }

    private String status;
}
