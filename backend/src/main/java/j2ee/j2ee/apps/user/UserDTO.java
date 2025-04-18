package j2ee.j2ee.apps.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate createdAt;
    private LocalDate updatedAt;
    private Long roleId;
    private String status;
}