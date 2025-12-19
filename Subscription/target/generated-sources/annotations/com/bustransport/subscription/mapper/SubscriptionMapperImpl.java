package com.bustransport.subscription.mapper;

import com.bustransport.subscription.dto.request.CreateSubscriptionRequest;
import com.bustransport.subscription.dto.response.SubscriptionResponse;
import com.bustransport.subscription.entity.Subscription;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-19T03:23:08+0100",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class SubscriptionMapperImpl implements SubscriptionMapper {

    @Override
    public Subscription toEntity(CreateSubscriptionRequest request) {
        if ( request == null ) {
            return null;
        }

        Subscription subscription = new Subscription();

        subscription.setUserId( request.getUserId() );
        subscription.setSubscriptionType( request.getSubscriptionType() );
        subscription.setAutoRenewal( request.getAutoRenewal() );

        return subscription;
    }

    @Override
    public SubscriptionResponse toResponse(Subscription subscription) {
        if ( subscription == null ) {
            return null;
        }

        SubscriptionResponse subscriptionResponse = new SubscriptionResponse();

        subscriptionResponse.setDaysRemaining( subscription.getDaysRemaining() );
        subscriptionResponse.setActive( subscription.isActive() );
        subscriptionResponse.setId( subscription.getId() );
        subscriptionResponse.setUserId( subscription.getUserId() );
        subscriptionResponse.setSubscriptionType( subscription.getSubscriptionType() );
        subscriptionResponse.setPrice( subscription.getPrice() );
        subscriptionResponse.setStartDate( subscription.getStartDate() );
        subscriptionResponse.setEndDate( subscription.getEndDate() );
        subscriptionResponse.setStatus( subscription.getStatus() );
        subscriptionResponse.setAutoRenewal( subscription.getAutoRenewal() );
        subscriptionResponse.setPaymentId( subscription.getPaymentId() );
        subscriptionResponse.setCancelledAt( subscription.getCancelledAt() );
        subscriptionResponse.setCancellationReason( subscription.getCancellationReason() );
        subscriptionResponse.setCreatedAt( subscription.getCreatedAt() );
        subscriptionResponse.setUpdatedAt( subscription.getUpdatedAt() );

        setCalculatedFields( subscriptionResponse, subscription );

        return subscriptionResponse;
    }
}
