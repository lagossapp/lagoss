# Installation

Deploying your own instance of Lagoss is straightforward and only requires some basic knowledge of Linux, Docker & DNS.

## Requirements

- A linux server with:
  - a static ip
  - [docker](https://docs.docker.com/engine/install/) installed
  - [docker-compose](https://docs.docker.com/compose/install/) installed
- A wildcard domain `*.your-domain.com` pointing to your server
- A Github O-Auth app

## Download `docker-compose.yml` & `.env`

```bash
# download docker-compose.yml
wget https://raw.githubusercontent.com/lagossapp/lagoss/main/docs/docker-compose.yml

# download .env file
wget https://raw.githubusercontent.com/lagossapp/lagoss/main/docs/.env.example -O .env

# download Caddyfile
wget https://raw.githubusercontent.com/lagossapp/lagoss/main/docs/Caddyfile
```

### Create Github OAuth app

For the login you need to create an OAuth app at Github to be able to login using your Github account.

TODO describe creating a OAuth app

### Configure your settings in `.env`

TODO

### Start setup

```bash
# start deployment
docker compose up -d

# access logs
docker compose logs -f
```

You should now be able to access the dashboard at `app.your-domain.com`.

### Enable https

TODO
