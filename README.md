# Volumetric

[see wiki](https://git.equinor.com/volumetric/main/wikis/)

## Development setup
Clone all three git repositories  
The file structure must look like this;  
```
volumetric/
  |
  --- api/
  |
  --- main/
  |
  --- web/
```
- Activate the projects CLI tool by running `main/bin/activate`
- Create a directory called uploads owned by uid:1000;  
`mkdir main/uploads && chown -R 1000:1000 main/uploads`  
- Start the application by running `volumetric up -d`

## Handling dependencies

### Api

Use the `volumetric-pipenv` for updating Pipfile and Pipfile.lock. You can also install pipenv locally.

Note: Make sure to update the Pipfile.lock when adding dependencies to Pipfile. The `--deploy` flag in api Dockerfile for pipenv install fails if Pipfile.lock is out of date.

### Web

Use the `volumetric-yarn` for updating package.json and yarn.lock. You can also install yarn locally.
