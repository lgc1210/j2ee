package j2ee.j2ee.apps.user;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.role.RoleEntity;
import j2ee.j2ee.apps.role.RoleRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
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
        if (!user.isPresent() && !passwordEncoder.matches(currentPassword, user.get().getPassword())) {
            return Optional.empty();
        }

        user.get().setPassword(passwordEncoder.encode(newPassword));

        return Optional.of(userRepository.save(user.get()));
    }

    public UserEntity createOrUpdate(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        RoleEntity role;
        if (user.getRole() == null)
            role = roleRepository.findById(2L)
                    .orElseThrow(() -> new RuntimeException("Customer role not found"));
        else
            role = roleRepository.findById(user.getRole().getId())
                    .orElseThrow(() -> new RuntimeException("Selected role not found"));
        user.setRole(role);

        return userRepository.save(user);
    }
}
