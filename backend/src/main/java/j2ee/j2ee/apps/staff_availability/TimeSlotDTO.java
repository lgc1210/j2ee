package j2ee.j2ee.apps.staff_availability;

import lombok.Data;

import java.time.LocalTime;

@Data
public class TimeSlotDTO {
    private LocalTime startTime;
    private LocalTime endTime;

    public TimeSlotDTO(LocalTime startTime, LocalTime endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
