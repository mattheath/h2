'use strict';

define(['src/Elasticride'], function(Elasticride) {

    module('Elasticride');

    test("getCustomerURL() returns the customer URL", function() {
        equal(
            new Elasticride('live').getCustomerURL('123'),
            'https://elasticride.com/customers/production/view/123'
        );
    });

    test("getCustomerURL() returns null in unknown environments", function() {
        equal(new Elasticride('foo').getCustomerURL('123'), null);
    });
});
