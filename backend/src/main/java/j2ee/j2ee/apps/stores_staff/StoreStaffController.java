package j2ee.j2ee.apps.stores_staff;

import java.util.HashMap;
import java.util.Optional;
import java.util.List;
import java.time.LocalDate;

import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
public class StoreStaffController {

    @Autowired
    private UserService userService;
    @Autowired
    private StoreStaffService staffService;

    @GetMapping("/ListStaff")
    public ResponseEntity<List<StoreStaffEntity>> getAllByLoggedInUser(Authentication authentication) {
        try {
            // Lấy thông tin username từ Authentication
            String username = authentication.getPrincipal().toString();
            System.out.println("Logged-in username: " + username);

            // Tìm UserEntity dựa trên email (username)
            Optional<UserEntity> userOptional = userService.getByEmail(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(404).build();
            }

            // Lấy userId từ UserEntity
            UserEntity loggedInUser = userOptional.get();
            System.out.println("Logged-in user ID: " + loggedInUser.getId());
            Long userId = loggedInUser.getId();

            // Lấy danh sách service dựa trên userId
            var staffList = this.staffService.getAllStaffByUserId(userId);
            if (staffList.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(staffList);
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }

    }

    @PostMapping("/createWithUser")
    public ResponseEntity<?> createStaffWithUser(@RequestBody StoreStaffEntity staffEntity) {
        try {
            UserEntity staffUser = staffEntity.getStaff();
            if (staffUser == null) {
                return ResponseEntity.badRequest().body("Thiếu thông tin user cho staff");
            }
            
            UserEntity createdUser = userService.create(staffUser);
            staffEntity.setStaff(createdUser);
            StoreStaffEntity createdStaff = staffService.createStaff(staffEntity);

            return ResponseEntity.ok(createdStaff);
        } catch (DataIntegrityViolationException e) {
           
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email hoặc số điện thoại đã tồn tại");
        } catch (Exception e) {
            System.err.println("Internal Server Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{staffId}")
    public ResponseEntity<StoreStaffEntity> updateStaff(
            @PathVariable Long staffId,
            @RequestBody StoreStaffEntity staffEntity) {
        try {
            StoreStaffEntity updatedStaff = staffService.updateStaff(staffId, staffEntity);
            if (updatedStaff == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedStaff);
        } catch (Exception e) {
            System.err.println("Error creating service: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{staffId}")
    public ResponseEntity<?> deleteStaff(@PathVariable Long staffId) {
        try {
            boolean deleted = staffService.deleteStaff(staffId);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting staff: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteMultipleStaffs(@RequestBody List<Long> staffIds) {
        try {
            boolean deleted = staffService.deleteMultipleStaff(staffIds);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error deleting multiple staffs: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

}
