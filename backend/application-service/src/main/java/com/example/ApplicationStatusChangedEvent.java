package com.example;

import org.springframework.context.ApplicationEvent;

public class ApplicationStatusChangedEvent extends ApplicationEvent {

    private final ApplicationEntity application;

    public ApplicationStatusChangedEvent(ApplicationEntity application) {
        super(application);
        this.application = application;
    }

    public ApplicationEntity getApplication() {
        return application;
    }
}