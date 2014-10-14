[![Build Status](https://travis-ci.org/sourcefabric-innovation/citizendesk-frontend.png?branch=master)](https://travis-ci.org/sourcefabric-innovation/citizendesk-frontend)
[![Coverage Status](https://coveralls.io/repos/sourcefabric-innovation/citizendesk-frontend/badge.png?branch=master)](https://coveralls.io/r/sourcefabric-innovation/citizendesk-frontend?branch=master)
[![devDependency Status](https://david-dm.org/sourcefabric-innovation/citizendesk-frontend/dev-status.svg)](https://david-dm.org/sourcefabric-innovation/citizendesk-frontend#info=devDependencies)
[![Issue Stats](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend/badge/pr?style=flat)](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend)
[![Issue Stats](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend/badge/issue?style=flat)](http://issuestats.com/github/sourcefabric-innovation/citizendesk-frontend)

### Citizen Desk Web Front End

This is the web front end for [Citizen
Desk](https://www.sourcefabric.org/en/citizendesk/). It provides a web
user interface communicating with a [Citizendesk Application
Programming Interface][interface] component.

You can try a demo
[here](https://sourcefabric-innovation.github.io/citizendesk-frontend/dist/),
picking an username like `User1`, `User2`, `User3`, with password
`no`.

#### Deployment

This is an Angular application produced with Yeoman, and as such it
can be deployed just serving the static files under `app/`. Remember
to install the Bower dependencies running bower install:

    $ bower install

In order to work, the front end has to be connected to a [Citizendesk
interface][interface] component, and you have to write its address in
the `config.server.url` configuration variable, which you can find in
`app/scripts/app.js`. This is the standard way to connect an [Eve API
client service](https://github.com/sourcefabric-innovation/eve-api) to
its server-side API provider.

#### Development notes

Tests use a `mocks` object built with a tool called
[mockatenate](https://github.com/danse/mockatenate). In order to
update the file, run the `./mockatenate` command from the root
repository folder

##### Deploy to the `gh-pages` branch

In the repo root there is a bash script which, in a correctly
configured system, will publish the current master to gh-pages. It
will run the tests, checkout the branch, rebase and push. It is not
error proof, it is just a shortcut. You are expected to understand
what it does. Once in a while, it will probably make sense to squash
all the `fix` commits there.

##### Test troubleshooting

There are some details in maintaining the tests that, if you do not
pay attention, makes you waste a lot of time. If your tests are
failing and you really do not know what is going on, check this list:

 - make sure that your mocks are updated using the `./mockatenate` script
 - if your are directly mocking HTTP, make sure that the API endpoint you are using (throug `eve-api`) is in the root mock
 - there is a build process concatenating all the templates. it is triggered automatically when a template is modified and `grunt serve` is running

[interface]: https://github.com/sourcefabric-innovation/citizendesk-interface
