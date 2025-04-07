package j2ee.j2ee.apps.role;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    // Create
    public RoleDTO createRole(RoleDTO roleDTO) {
        RoleEntity roleEntity = RoleEntity.builder()
                .name(roleDTO.getName())
                .build();
        RoleEntity savedEntity = roleRepository.save(roleEntity);
        return mapToDTO(savedEntity);
    }

    // lấy tất cả
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // lấy theo ID
    public RoleDTO getRoleById(Long id) {
        RoleEntity roleEntity = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role với ID: " + id));
        return mapToDTO(roleEntity);
    }

    // Update
    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        RoleEntity roleEntity = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role với ID: " + id));
        roleEntity.setName(roleDTO.getName());
        RoleEntity updatedEntity = roleRepository.save(roleEntity);
        return mapToDTO(updatedEntity);
    }

    // Delete
    public void deleteRole(Long id) {
        if (!roleRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy role với ID: " + id);
        }
        roleRepository.deleteById(id);
    }

    // Delete multiple
    @Transactional
    public void deleteMultipleRoles(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("Danh sách ID không được rỗng");
        }
        roleRepository.deleteAllByIdIn(ids);
    }

    //  Chuyển từ Entity sang DTO
    private RoleDTO mapToDTO(RoleEntity roleEntity) {
        return RoleDTO.builder()
                .id(roleEntity.getId())
                .name(roleEntity.getName())
                .build();
    }
}