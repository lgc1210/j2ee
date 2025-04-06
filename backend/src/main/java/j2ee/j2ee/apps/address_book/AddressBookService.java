package j2ee.j2ee.apps.address_book;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
public class AddressBookService {

    private final AddressBookRepository addressBookRepository;

    @Autowired
    public AddressBookService(AddressBookRepository addressBookRepository) {
        this.addressBookRepository = addressBookRepository;
    }

    public Optional<List<AddressBookEntity>> getAllByUserId(long userId) {
        List<AddressBookEntity> addressList = this.addressBookRepository.findAllByUserId(userId);
        return Optional.ofNullable(addressList);
    }

    public Optional<AddressBookEntity> getByUserId(long userId) {
        AddressBookEntity address = this.addressBookRepository.findByUserId(userId);
        return Optional.ofNullable(address);
    }

    public void deleteById(long id) {
        this.addressBookRepository.deleteById(id);
    }

    @Transactional
    public AddressBookEntity create(AddressBookEntity address) {
        if (Boolean.TRUE.equals(address.getIsDefault())) {
            addressBookRepository.clearDefaultForUser(address.getUser().getId());
        }
        return this.addressBookRepository.save(address);
    }

    @Transactional
    public AddressBookEntity update(long id, AddressBookEntity address) {
        AddressBookEntity existingAddress = this.addressBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (Boolean.TRUE.equals(address.getIsDefault())) {
            addressBookRepository.clearDefaultForUser(existingAddress.getUser().getId());
        }

        existingAddress.setName(address.getName());
        existingAddress.setPhone(address.getPhone());
        existingAddress.setAddress(address.getAddress());
        existingAddress.setIsDefault(address.getIsDefault());
        existingAddress.setType(address.getType());

        return this.addressBookRepository.save(existingAddress);
    }
}
