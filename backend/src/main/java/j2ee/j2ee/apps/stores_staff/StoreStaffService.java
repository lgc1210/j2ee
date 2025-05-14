package j2ee.j2ee.apps.stores_staff;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreStaffService {

    @Autowired
    private StoreStaffRepository storeStaffRepository;


}
