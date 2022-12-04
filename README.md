# Fixure Management.

## Prerequisites

- docker
- docker-compose
- nodejs - ^14.x.x
- yarn

# Local instructions:

```sh
yarn install

# Run in another terminal
docker-compose up

# Wait for mysql starting up, and then run the app in local in another terminal
yarn start:app:dev

# The db schema would be synchronize for app.

```

# Api docs:

- After the app starting up, access http://localhost:3000/api to see the swagger docs.
- Import Fixture_management.postman_collection.json for Postman predefined collection.

# Db diagram:

- Open db_diagram.png file to see the generated db diagram.

# Db import/seed data:

- You can Import local.sql for some predefined data.
