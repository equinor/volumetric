# Volumetric

[see wiki](https://git.equinor.com/volumetric/main/wikis/)

## Production setup
1. Clone this git repository (volumetric/main)
2. Login to the Docker registry (git.equinor.com:4567)
3. Copy and populate the `secrets.env.template`. Call it `main/secrets.env`.
4. Create a directory called `main/uploads` owned by **uid:1000**. Alternatively, create a user called volumetric with uid:1000 and use that.
5. Add the SSL Certificate Key to `main/proxy/x.volumetric.equinor.com.key`. Set permissions to 400.
6. Point desired DNS to this host.
7. Run `./bin/activate volumetric up -d`

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
- Start the application by running `volumetric up -d`

## Handling dependencies

### Api

Use the `volumetric-pipenv` for updating Pipfile and Pipfile.lock. You can also install pipenv locally.

Note: Make sure to update the Pipfile.lock when adding dependencies to Pipfile. The `--deploy` flag in api Dockerfile for pipenv install fails if Pipfile.lock is out of date.

### Web

Use the `volumetric-yarn` for updating package.json and yarn.lock. You can also install yarn locally.

