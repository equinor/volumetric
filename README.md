# Volumetric

[see wiki](https://git.equinor.com/volumetric/main/wikis/)

## Development setup

- Clone the repo + enter the repo  
```git clone git@git.equinor.com:volumetric/main.git```
- Activate the project ```bin/activate```
- If you are missing the API and Web repos, clone those by running "clone-repos"
- Start the application by running ```volumetric up -d```

## Handling dependencies

### Api

Use the ```volumetric-pipenv``` for updating Pipfile and Pipfile.lock. You can also install pipenv locally.

Note: Make sure to update the Pipfile.lock when adding dependencies to Pipfile. The ```--deploy``` flag in api Dockerfile for pipenv install fails if Pipfile.lock is out of date.

### Web

Use the ```volumetric-yarn``` for updating package.json and yarn.lock. You can also install yarn locally.
