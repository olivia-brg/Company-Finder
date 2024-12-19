package com.company_finder.back.services;

import java.util.List;

import org.springframework.stereotype.Service;
import com.company_finder.back.models.Activity;
import com.company_finder.back.repositories.ActivityRepository;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public List<Activity> findAllActivities() {
        return activityRepository.findAllActivities();
    }

}
