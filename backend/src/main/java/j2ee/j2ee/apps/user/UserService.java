package j2ee.j2ee.apps.user;

import java.util.List;
import java.util.Optional;
import j2ee.j2ee.constants.ErrorMessages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import j2ee.j2ee.apps.role.RoleEntity;
import j2ee.j2ee.apps.role.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO toUserDTO(UserEntity user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setCreatedAt(user.getCreated_at());
        dto.setUpdatedAt(user.getUpdate_at());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());

        return dto;
    }

    public List<UserEntity> getAll() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getById(long id) {
        return userRepository.findById(id);
    }

    public Optional<UserEntity> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<UserEntity> getByPhone(String phone) {
        return userRepository.findByPhone(phone);
    }

    public Optional<UserEntity> changePassword(long id, String currentPassword, String newPassword) {
        Optional<UserEntity> user = userRepository.findById(id);
        if (!user.isPresent() || !passwordEncoder.matches(currentPassword, user.get().getPassword())) {
            return Optional.empty();
        }

        user.get().setPassword(passwordEncoder.encode(newPassword));

        return Optional.of(userRepository.save(user.get()));
    }

    public UserEntity create(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        RoleEntity role;
        if (user.getRole() == null) {
            role = roleRepository.findById(2L) // Role: customer
                    .orElseThrow(() -> new RuntimeException("Customer role not found"));
        } else {
            role = roleRepository.findById(
                    user.getRole().getId())
                    .orElseThrow(() -> new RuntimeException("Selected role not found"));
        }
        user.setRole(role);
        return userRepository.save(user);
    }

    public List<UserEntity> getUsersByRoleId(Long roleId) {
        return userRepository.getListByRoleID(roleId);
    }

    public UserEntity update(long id, UserEntity updatedUser) {
        UserEntity existingUser = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            Optional<UserEntity> email = userRepository.findByEmail(updatedUser.getEmail());
            if (email.isPresent() && email.get().getId() != id) {
                throw new RuntimeException(ErrorMessages.EMAIL_CONFLICT);
            }
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPhone() != null) {
            Optional<UserEntity> phone = userRepository.findByPhone(updatedUser.getPhone());
            if (phone.isPresent() && phone.get().getId() != id) {
                throw new RuntimeException(ErrorMessages.PHONE_CONFLICT);
            }
            existingUser.setPhone(updatedUser.getPhone());
        }

        return userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy  với ID: " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public void deleteMultipleUsers(List<Long> ids) {
        userRepository.deleteAllByIdIn(ids);
    }

    // Mã hóa mật khẩu

}
