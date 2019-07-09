# Volumetric

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
