# Setting up Keycloak for caMicroscope

* Set up Keycloak (covered by docker compose kc_caMicroscope.yml)
    * URL for this is [http://localhost:8080/admin/master/console/#/](http://localhost:8080/admin/master/console/#/), sub host/port as needed
* Set up realm
    * Add realm called ‘camic’
    * All following steps happen in this realm.
* Set up client
    * Clients -> Add Client
    * Set client_id to camicroscope-test.
    * Openid connect with mostly default settings, but **set client authentication to on**
    * Once saved, Under the credentials tab, get the client secret
    * Add the client secret to config/keycloak_login.html for client_secret.
* Add users
    * Users -> add user
    * Make sure to add an email to match user documents in mongo.
    * Set a password under credentials -> add password
