This integration recipe integrates Shopware with Mailchimp. 
It will automatically add each new newsletter subscriber from Shopware shop to the selected Mailchimp list.
Each customer or newsletter subscriber who will modify subscription settings by un-subscribing from the newsletter
will also be un-subscribed in Mailchimp.

You should be aware of following:

 * This integration recipe works in combination with **elastic.io Shopware Newsletter plugin**
 * You should have following merge fields available in your list - ```FNAME```, ```LNAME``` and ```SALUTATION```
 * Information about opt-in time and opt-in IP will be transferred to Mailchimp
 * When subscriber is un-subscribed her information is not removed from Mailchimp, but only an un-subscription
 flag is set