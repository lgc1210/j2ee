package j2ee.j2ee.apps.statistics;

import j2ee.j2ee.apps.store.StoreEntity;
import lombok.Data;

@Data
public class StoreStatsDTO {
    private long storeId;
    private String storeName;
    private double value; // Represents appointment count or revenue

    public StoreStatsDTO(StoreEntity store, double value) {
        this.storeId = store.getId();
        this.storeName = store.getName();
        this.value = value;
    }
}