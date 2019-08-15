# Volumetric
System for storing, accessing, and analyzing volumetric data.
## Access Control
Authentication (proof of identity) of users is done via Azure Active Directory(AAD).  
Authorization (enforcement of an access policy) is done in the Volumetric application database, where AAD usernames are mapped to Volumetric specific roles.

To become an administrator, you must have the role granted in the _azure application_ called volumetric.  
Administrators can then grant the _Field Admin_ role to other users.

#### Access Control Matrix
|Action|Admin|Field Admin|Creator|Reader|
|-------|-------|----------|-------|-----|
|Edit Fields| Yes| No|No| No|
|Edit users on field| Yes|Yes| No| No|
|Import official cases| Yes|Yes|No|No|
|Import cases| Yes| Yes| Yes|No|
|View shared and official cases| Yes| Yes| Yes |Yes|
## How to use

Copy the file `main/secrets.env.template` to `main/secrets.env` and set the variables in the file.

- Activate the project

    Activate the project by running activate script in main repo
    `./main/bin/activate`

    You can now start the project by using the `volumetric` command. This is just a wrapper for docker-compose.

- Build
    `volumetric build`

- Run
    `volumetric up`

### Pre-commit hook:

Make sure you have built the project first, as the pre-commit hook uses the api image.

- Install yarn locally

- Add the pre-commit hook:
    `ln -s $PWD/pre-commit $PWD/.git/hooks/pre-commit`

Prettier and yapf should now run when you commit changes.
