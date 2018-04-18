Volumetric webapp.

### Activate the project

Activate the project by running activate script in main repo

`<PATH TO MAIN REPO>/bin/activate`

### Pre-commit hook:

Make sure the project is activated.

Install the node_modules:

`volumetric-npm install`

If you don't have node/npm installed, or you want to use the npm-version in the docker image instead (recommended):

`cp pre-commit.template .git/hooks/pre-commit`

Prettier should now run when you commit changes.
