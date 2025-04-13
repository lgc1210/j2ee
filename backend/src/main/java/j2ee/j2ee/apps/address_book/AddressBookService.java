package j2ee.j2ee.apps.address_book;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

@Service
@Transactional
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

    public Optional<AddressBookEntity> getById(long id) {
        Optional<AddressBookEntity> address = this.addressBookRepository.findById(id);
        return address;
    }

    public void deleteById(long id) {
        this.addressBookRepository.deleteById(id);
    }

    public AddressBookEntity create(AddressBookEntity payload) {
        if (Boolean.TRUE.equals(payload.getIs_default())) {
            this.addressBookRepository.clearDefaultForUser(payload.getUser().getId());
        } else {
            boolean hasExistingAddresses =
                    !addressBookRepository.findAllByUserId(payload.getUser().getId()).isEmpty();
            if (!hasExistingAddresses) {
                payload.setIs_default(false);
            }
        }

        return this.addressBookRepository.save(payload);
    }

    public AddressBookEntity update(long id, AddressBookEntity address) {
        AddressBookEntity existingAddress = this.addressBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (Boolean.TRUE.equals(address.getIs_default())) {
            this.addressBookRepository.clearDefaultForUser(existingAddress.getUser().getId());
        }

        existingAddress.setName(address.getName());
        existingAddress.setPhone(address.getPhone());
        existingAddress.setAddress(address.getAddress());
        existingAddress.setIs_default(address.getIs_default());
        existingAddress.setType(address.getType());

        return this.addressBookRepository.save(existingAddress);
    }


    public void setDefaultById(long id, long userId) {
        this.addressBookRepository.clearDefaultForUser(userId);

        AddressBookEntity updatedAddress = this.getById(id).get();

        updatedAddress.setIs_default(true);

        this.addressBookRepository.save(updatedAddress);
    }
}
