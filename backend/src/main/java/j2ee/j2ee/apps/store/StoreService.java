package j2ee.j2ee.apps.store;

import j2ee.j2ee.apps.user.UserDTO;
import j2ee.j2ee.apps.user.UserEntity;
import j2ee.j2ee.apps.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private UserRepository userRepository;

    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public List<StoreEntity> filterByCategoryOfServiceId(Long category_of_service_id) {
        return this.storeRepository.filterByCategoryOfServiceId(category_of_service_id);
    }

    public Page<StoreEntity> getAllStorePage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "name"));
        return this.storeRepository.findAllPage(pageable);
    }

    public Optional<List<StoreEntity>> getAllForAdmin() {
        return Optional.ofNullable(this.storeRepository.findAll());
    }

    public Optional<StoreEntity> getById(Long id) {
        return this.storeRepository.findById(id);
    }

    public Optional<StoreEntity> getByOwnerId(Long ownerId) {
        return storeRepository.findByOwnerId(ownerId);
    }

    public Optional<StoreEntity> getStoreByUserId(Long userId) {
        return storeRepository.findStoreByUserId(userId);
    }

    public StoreEntity updateStore(Long id, StoreEntity updatedStore) {
        // Kiểm tra xem store có tồn tại không
        Optional<StoreEntity> existingStoreOptional = storeRepository.findById(id);
        if (existingStoreOptional.isEmpty()) {
            throw new RuntimeException("Store with ID " + id + " not found");
        }

        // Lấy store hiện tại và cập nhật thông tin
        StoreEntity existingStore = existingStoreOptional.get();
        existingStore.setName(updatedStore.getName());
        existingStore.setDescription(updatedStore.getDescription());
        existingStore.setAddress(updatedStore.getAddress());
        existingStore.setPhone(updatedStore.getPhone());
//        existingStore.setImage(updatedStore.getImage());
        existingStore.setOpen_time(updatedStore.getOpen_time());
        existingStore.setClose_time(updatedStore.getClose_time());
        existingStore.setStatus(updatedStore.getStatus());

        // Lưu store đã cập nhật
        return storeRepository.save(existingStore);
    }

    private StoreDTO toDTO(StoreEntity entity) {
        StoreDTO dto = StoreDTO.builder().id(entity.getId()).name(entity.getName()).description(entity.getDescription()).address(entity.getAddress()).phone(entity.getPhone())
//                .image(entity.getImage())
                .createdAt(formatDateTime(entity.getCreated_at())).updatedAt(formatDateTime(entity.getUpdated_at())).openTime(formatTime(entity.getOpen_time())).closeTime(formatTime(entity.getClose_time())).status(entity.getStatus()).build();

        if (entity.getOwner() != null) {
            UserDTO ownerDTO = new UserDTO();
            ownerDTO.setId(entity.getOwner().getId());
            ownerDTO.setName(entity.getOwner().getName());
            dto.setOwnerId(ownerDTO);
        }

        return dto;
    }

    private StoreEntity toEntity(StoreDTO dto) {
        StoreEntity entity = new StoreEntity();

        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setAddress(dto.getAddress());
        entity.setPhone(dto.getPhone());
//        entity.setImage(dto.getImage());
        entity.setCreated_at(parseDateTime(dto.getCreatedAt(), LocalDateTime.now()));
        entity.setUpdated_at(parseDateTime(dto.getUpdatedAt(), LocalDateTime.now()));
        entity.setOpen_time(parseTime(dto.getOpenTime()));
        entity.setClose_time(parseTime(dto.getCloseTime()));
        entity.setStatus(dto.getStatus());

        if (dto.getOwnerId() != null) {
            Long ownerId = dto.getOwnerId().getId();
            if (ownerId != null) {
                UserEntity owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + ownerId));
                entity.setOwner(owner);
            }
        }

        return entity;
    }

    private String formatDateTime(LocalDateTime dt) {
        return dt != null ? dt.format(dateTimeFormatter) : null;
    }

    private String formatTime(LocalTime time) {
        return time != null ? time.toString() : null;
    }

    private LocalDateTime parseDateTime(String dateTimeStr, LocalDateTime defaultValue) {
        try {
            return dateTimeStr != null ? LocalDateTime.parse(dateTimeStr, dateTimeFormatter) : defaultValue;
        } catch (Exception e) {
            return defaultValue;
        }
    }

    private LocalTime parseTime(String timeStr) {
        try {
            return timeStr != null ? LocalTime.parse(timeStr) : null;
        } catch (Exception e) {
            return null;
        }
    }

    @Transactional
    public StoreDTO createStore(StoreDTO storeDTO) {
        StoreEntity entity = toEntity(storeDTO);
        entity.setCreated_at(LocalDateTime.now());
        entity.setUpdated_at(LocalDateTime.now());
        StoreEntity saved = storeRepository.save(entity);
        return toDTO(saved);
    }

    public List<StoreDTO> getAllStores() {
        return storeRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public StoreDTO getStoreById(Long id) {
        return storeRepository.findById(id).map(this::toDTO).orElseThrow(() -> new RuntimeException("Không tìm thấy store với ID: " + id));
    }

    @Transactional
    public StoreEntity updateStoreOwner(Long id, StoreEntity storeData) {
        StoreEntity entity = storeRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy store với ID: " + id));

        entity.setName(storeData.getName());
        entity.setDescription(storeData.getDescription());
        entity.setAddress(storeData.getAddress());
        entity.setPhone(storeData.getPhone());

        if (storeData.getImage() != null) {
            entity.setImage(storeData.getImage());
        }

        entity.setOpen_time(storeData.getOpen_time());
        entity.setClose_time(storeData.getClose_time());
        entity.setStatus(storeData.getStatus());

        if (storeData.getOwner() != null && storeData.getOwner().getId() != null) {
            UserEntity owner = userRepository.findById(storeData.getOwner().getId()).orElseThrow(() -> new RuntimeException("Không tìm thấy user với ID: " + storeData.getOwner().getId()));
            entity.setOwner(owner);
        }

        return storeRepository.save(entity);
    }

    @Transactional
    public Optional<StoreEntity> softDeleteById(Long id) {
        StoreEntity entity = storeRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy store với ID: " + id));
        entity.setStatus("Inactive");
        return Optional.ofNullable(storeRepository.save(entity));
    }

    @Transactional
    public void deleteMultipleStores(List<Long> ids) {
        storeRepository.deleteAllByIdIn(ids);
    }



    public void importStores(List<StoreEntity> stores) {
        LocalDateTime importTime = LocalDateTime.now();
        stores.forEach(store -> {
            if (store.getName() == null || store.getName().trim().isEmpty()) {
                store.setName("Unnamed Store");
            }
            store.setCreated_at(importTime);
            store.setUpdated_at(importTime);
        });

        storeRepository.saveAll(stores);
    }
}
