package j2ee.j2ee.apps.dayoff;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dayoffs")
public class DayoffController {
    @Autowired
    private DayoffService dayoffService;
    @Autowired
    private UserService userService;

    @GetMapping("/ListHolidays")
    public ResponseEntity<List<DayoffEntity>> getAllByLoggedInUser(Authentication authentication) {
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }
            String username = authentication.getPrincipal().toString();
            Optional<UserEntity> userOptional = userService.getByEmail(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).build();
            }
            Long userId = userOptional.get().getId();
            var dayoffList = this.dayoffService.getDayoffsByStore(userId);
            if (dayoffList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(dayoffList);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping
    public ResponseEntity<DayoffEntity> createDayoff(@RequestBody DayoffEntity dayoffEntity) {
        try {
            DayoffEntity createdDayoff = dayoffService.createDayoff(dayoffEntity);
            return ResponseEntity.ok(createdDayoff);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

        @DeleteMapping("/{dayoff_id}")
    public ResponseEntity<Void> deleteDayoff(@PathVariable(value = "dayoff_id") long dayoffId) {
        try {
            Optional<DayoffEntity> existingDayoff = dayoffService.getById(dayoffId);
            if (existingDayoff.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
    
            dayoffService.deleteDayoff(dayoffId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.err.println("Error deleting dayoff: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}