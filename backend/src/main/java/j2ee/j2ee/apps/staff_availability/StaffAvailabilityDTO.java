package j2ee.j2ee.apps.staff_availability;

import j2ee.j2ee.apps.user.UserEntity;
import lombok.Data;

@Data
public class StaffAvailabilityDTO {
    private long staff_id;
    private String staff_name;

    public StaffAvailabilityDTO(UserEntity staff) {
        this.staff_id = staff.getId();
        this.staff_name = staff.getName();
    }
}
