package com.company_finder.back.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company_finder.back.models.Activity;
import com.company_finder.back.repositories.ActivityRepository;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping("")
    public List<Activity> getActivities() {
        return activityRepository.findAllActivities();
    }

}
