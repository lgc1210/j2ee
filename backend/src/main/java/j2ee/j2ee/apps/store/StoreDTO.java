package j2ee.j2ee.apps.store;

import j2ee.j2ee.apps.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StoreDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String phone;
    private MultipartFile image;
    private String createdAt;
    private String updatedAt;
    private String openTime;
    private String closeTime;
    private String status;
    private UserDTO ownerId;
}