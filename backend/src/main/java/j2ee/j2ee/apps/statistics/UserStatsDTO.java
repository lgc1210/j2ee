package j2ee.j2ee.apps.statistics;

import j2ee.j2ee.apps.store.StoreEntity;
import lombok.Data;
import j2ee.j2ee.apps.user.UserEntity;
import lombok.Data;

@Data
public class UserStatsDTO {
    private long userId;
    private String userName;
    private String email;
    private int appointmentCount;

    public UserStatsDTO(UserEntity user, int appointmentCount) {
        this.userId = user.getId();
        this.userName = user.getName();
        this.email = user.getEmail();
        this.appointmentCount = appointmentCount;
    }
}