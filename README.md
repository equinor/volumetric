Volumetric webapp.

### Activate the project

Activate the project by running activate script in main repo

`<PATH TO MAIN REPO>/bin/activate`

### Pre-commit hook:

Install yarn locally

Install packages locally:

`yarn --pure-lockfile`

Make sure the project is activated.

Add the pre-commit hook:

`cp pre-commit.template .git/hooks/pre-commit`

Prettier should now run when you commit changes.

### Install graphql plugin for Jetbrains IDEs

File > Settings > Plugins > Browse repositories > Search for 'qrapql' and install