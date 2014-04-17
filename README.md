### Citizendesk frontend

This is the frontend for Citizendesk. It will serve a web interface
connected with a [Citizendesk interface][interface] component.

#### Deployment

This is an Angular application produced with Yeoman, and as such it
can be deployed just serving the static files under `app/`. Remember
to install the Bower dependencies running bower install:

    $ bower install

In order to work, the front end has to be connected to a [Citizendesk
interface][interface] component, and you have to write its address in
the file `app/scripts/app.js`, as the value for the javascript
variable `$sailsProvider.url`. For example, if your [API][interface]
is running on the domain `mydomain.org` on the port `1337`, you should
modify `app/script/app.js` writing:

    $sails.Provider.url = 'http://mydomain.org:1337';

[interface]: https://github.com/sourcefabric-innovation/citizendesk-interface
