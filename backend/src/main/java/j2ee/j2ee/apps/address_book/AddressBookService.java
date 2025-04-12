package j2ee.j2ee.apps.address_book;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import j2ee.j2ee.constants.ErrorMessages;
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
    public AddressBookEntity create(AddressBookEntity payload) {
        if (addressBookRepository.checkDuplicatedAddress(payload.getAddress(), payload.getPhone(),
                payload.getName())) {
            throw new RuntimeException(ErrorMessages.ADDRESS_CONFLICT);
        }

        if (Boolean.TRUE.equals(payload.getIs_default())) {
            addressBookRepository.clearDefaultForUser(payload.getUser().getId());

        }
        return this.addressBookRepository.save(payload);
    }

    @Transactional
    public AddressBookEntity update(long id, AddressBookEntity address) {
        AddressBookEntity existingAddress = this.addressBookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (addressBookRepository.checkDuplicatedAddress(address.getAddress(), address.getPhone(),
                address.getName())) {
            throw new RuntimeException(ErrorMessages.ADDRESS_CONFLICT);
        }

        if (Boolean.TRUE.equals(address.getIs_default())) {
            addressBookRepository.clearDefaultForUser(existingAddress.getUser().getId());
        }

        existingAddress.setName(address.getName());
        existingAddress.setPhone(address.getPhone());
        existingAddress.setAddress(address.getAddress());
        existingAddress.setIs_default(address.getIs_default());
        existingAddress.setType(address.getType());

        return this.addressBookRepository.save(existingAddress);
    }
}
