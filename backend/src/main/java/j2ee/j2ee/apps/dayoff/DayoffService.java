package j2ee.j2ee.apps.dayoff;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import j2ee.j2ee.apps.discount.DiscountEntity;

import java.util.List;
import java.util.Optional;

@Service
public class DayoffService {
    @Autowired
    private DayoffRepository dayoffRepository;

    public List<DayoffEntity> getDayoffsByStore(Long userId) {
        return dayoffRepository.findAllByLoggedInUser(userId);
    }

    public DayoffEntity createDayoff(DayoffEntity dayoffEntity) {
        return dayoffRepository.save(dayoffEntity);
    }

     public Optional<DayoffEntity> getById(Long id) {
        return dayoffRepository.findById(id);
    }

    public void deleteDayoff(Long id) {
        dayoffRepository.deleteById(id);
    }
}