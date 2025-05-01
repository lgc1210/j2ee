package j2ee.j2ee.apps.statistics;

import j2ee.j2ee.apps.store.StoreEntity;
import j2ee.j2ee.apps.user.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StatisticsService {

    @Autowired
    private StatisticsRepository statisticsRepository;

    public Map<String, List<StoreStatsDTO>> getStoreAppointmentStats(String timeFilter, String specificFilter) {
        LocalDate[] timeRange = applyTimeFilter(timeFilter, specificFilter);
        LocalDate start = timeRange[0];
        LocalDate end = timeRange[1];

        List<Object[]> highestResults = statisticsRepository.findStoreAppointmentStats(start, end);
        List<StoreStatsDTO> highest = new ArrayList<>();
        for (Object[] result : highestResults.subList(0, Math.min(10, highestResults.size()))) {
            highest.add(new StoreStatsDTO((StoreEntity) result[0], ((Long) result[1]).doubleValue()));
        }

        List<Object[]> lowestResults = statisticsRepository.findStoreAppointmentStatsAsc(start, end);
        List<StoreStatsDTO> lowest = new ArrayList<>();
        for (Object[] result : lowestResults.subList(0, Math.min(10, lowestResults.size()))) {
            lowest.add(new StoreStatsDTO((StoreEntity) result[0], ((Long) result[1]).doubleValue()));
        }

        Map<String, List<StoreStatsDTO>> result = new HashMap<>();
        result.put("mostBooked", highest);
        result.put("leastBooked", lowest);
        return result;
    }

    public Map<String, List<StoreStatsDTO>> getStoreRevenueStats(String timeFilter, String specificFilter) {
        LocalDateTime[] timeRange = applyTimeFilterForRevenue(timeFilter, specificFilter);
        LocalDateTime start = timeRange[0];
        LocalDateTime end = timeRange[1];

        List<Object[]> highestResults = statisticsRepository.findStoreRevenueStats(start, end);
        List<StoreStatsDTO> highest = new ArrayList<>();
        for (Object[] result : highestResults.subList(0, Math.min(10, highestResults.size()))) {
            highest.add(new StoreStatsDTO((StoreEntity) result[0], (Double) result[1]));
        }

        List<Object[]> lowestResults = statisticsRepository.findStoreRevenueStatsAsc(start, end);
        List<StoreStatsDTO> lowest = new ArrayList<>();
        for (Object[] result : lowestResults.subList(0, Math.min(10, lowestResults.size()))) {
            lowest.add(new StoreStatsDTO((StoreEntity) result[0], (Double) result[1]));
        }

        Map<String, List<StoreStatsDTO>> result = new HashMap<>();
        result.put("highestRevenue", highest);
        result.put("lowestRevenue", lowest);
        return result;
    }

    public Map<String, List<UserStatsDTO>> getCustomerAppointmentStats(String timeFilter, String specificFilter) {
        LocalDate[] timeRange = applyTimeFilter(timeFilter, specificFilter);
        LocalDate start = timeRange[0];
        LocalDate end = timeRange[1];

        List<Object[]> highestResults = statisticsRepository.findCustomerAppointmentStats(start, end);
        List<UserStatsDTO> highest = new ArrayList<>();
        for (Object[] result : highestResults.subList(0, Math.min(10, highestResults.size()))) {
            highest.add(new UserStatsDTO((UserEntity) result[0], ((Long) result[1]).intValue()));
        }

        List<Object[]> lowestResults = statisticsRepository.findCustomerAppointmentStatsAsc(start, end);
        List<UserStatsDTO> lowest = new ArrayList<>();
        for (Object[] result : lowestResults.subList(0, Math.min(10, lowestResults.size()))) {
            lowest.add(new UserStatsDTO((UserEntity) result[0], ((Long) result[1]).intValue()));
        }

        Map<String, List<UserStatsDTO>> result = new HashMap<>();
        result.put("mostBooked", highest);
        result.put("leastBooked", lowest);
        return result;
    }

    public Map<String, List<UserStatsDTO>> getStaffAppointmentStats(String timeFilter, String specificFilter) {
        LocalDate[] timeRange = applyTimeFilter(timeFilter, specificFilter);
        LocalDate start = timeRange[0];
        LocalDate end = timeRange[1];

        List<Object[]> highestResults = statisticsRepository.findStaffAppointmentStats(start, end);
        List<UserStatsDTO> highest = new ArrayList<>();
        for (Object[] result : highestResults.subList(0, Math.min(10, highestResults.size()))) {
            highest.add(new UserStatsDTO((UserEntity) result[0], ((Long) result[1]).intValue()));
        }

        List<Object[]> lowestResults = statisticsRepository.findStaffAppointmentStatsAsc(start, end);
        List<UserStatsDTO> lowest = new ArrayList<>();
        for (Object[] result : lowestResults.subList(0, Math.min(10, lowestResults.size()))) {
            lowest.add(new UserStatsDTO((UserEntity) result[0], ((Long) result[1]).intValue()));
        }

        Map<String, List<UserStatsDTO>> result = new HashMap<>();
        result.put("mostBooked", highest);
        result.put("leastBooked", lowest);
        return result;
    }

    private LocalDate[] applyTimeFilter(String timeFilter, String specificFilter) {
        LocalDate now = LocalDate.now();
        LocalDate start = null;
        LocalDate end = null;

        switch (timeFilter.toLowerCase()) {
            case "weekly":
                if (specificFilter != null && specificFilter.matches("\\d{4}-W\\d{1,2}")) {
                    String[] parts = specificFilter.split("-W");
                    int year = Integer.parseInt(parts[0]);
                    int week = Integer.parseInt(parts[1]);
                    start = LocalDate.of(year, 1, 1)
                            .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, week)
                            .with(java.time.temporal.ChronoField.DAY_OF_WEEK, 1);
                    end = start.plusDays(6);
                } else {
                    start = now.with(java.time.temporal.ChronoField.DAY_OF_WEEK, 1);
                    end = start.plusDays(6);
                }
                break;
            case "monthly":
                if (specificFilter != null && specificFilter.matches("\\d{4}-\\d{1,2}")) {
                    String[] parts = specificFilter.split("-");
                    int year = Integer.parseInt(parts[0]);
                    int month = Integer.parseInt(parts[1]);
                    start = LocalDate.of(year, month, 1);
                    end = start.plusMonths(1).minusDays(1);
                } else {
                    start = now.withDayOfMonth(1);
                    end = start.plusMonths(1).minusDays(1);
                }
                break;
            case "yearly":
                int year = specificFilter != null ? Integer.parseInt(specificFilter) : now.getYear();
                start = LocalDate.of(year, 1, 1);
                end = start.plusYears(1).minusDays(1);
                break;
            case "all":
            default:
                break;
        }
        return new LocalDate[]{start, end};
    }

    private LocalDateTime[] applyTimeFilterForRevenue(String timeFilter, String specificFilter) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = null;
        LocalDateTime end = null;

        switch (timeFilter.toLowerCase()) {
            case "weekly":
                if (specificFilter != null && specificFilter.matches("\\d{4}-W\\d{1,2}")) {
                    String[] parts = specificFilter.split("-W");
                    int year = Integer.parseInt(parts[0]);
                    int week = Integer.parseInt(parts[1]);
                    LocalDate weekStart = LocalDate.of(year, 1, 1)
                            .with(IsoFields.WEEK_OF_WEEK_BASED_YEAR, week)
                            .with(java.time.temporal.ChronoField.DAY_OF_WEEK, 1);
                    start = weekStart.atStartOfDay();
                    end = weekStart.plusDays(6).atTime(23, 59, 59);
                } else {
                    LocalDate weekStart = now.toLocalDate().with(java.time.temporal.ChronoField.DAY_OF_WEEK, 1);
                    start = weekStart.atStartOfDay();
                    end = weekStart.plusDays(6).atTime(23, 59, 59);
                }
                break;
            case "monthly":
                if (specificFilter != null && specificFilter.matches("\\d{4}-\\d{1,2}")) {
                    String[] parts = specificFilter.split("-");
                    int year = Integer.parseInt(parts[0]);
                    int month = Integer.parseInt(parts[1]);
                    LocalDate monthStart = LocalDate.of(year, month, 1);
                    start = monthStart.atStartOfDay();
                    end = monthStart.plusMonths(1).minusDays(1).atTime(23, 59, 59);
                } else {
                    LocalDate monthStart = now.toLocalDate().withDayOfMonth(1);
                    start = monthStart.atStartOfDay();
                    end = monthStart.plusMonths(1).minusDays(1).atTime(23, 59, 59);
                }
                break;
            case "yearly":
                int year = specificFilter != null ? Integer.parseInt(specificFilter) : now.getYear();
                LocalDate yearStart = LocalDate.of(year, 1, 1);
                start = yearStart.atStartOfDay();
                end = yearStart.plusYears(1).minusDays(1).atTime(23, 59, 59);
                break;
            case "all":
            default:
                break;
        }
        return new LocalDateTime[]{start, end};
    }
}