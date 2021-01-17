LHFT
======

## How to run

### Prerequisites
- docker
- docker-compose

Easiest way to run is to use Makefile
```sh
make start
```
and navigate to [localhost:3000](http://localhost:3000)

or 
```sh
docker-compose up
```
and navigate to [localhost:3000](http://localhost:3000)

if `docker-compose` nor `make` are an option try with:
```sh
docker run -d -it --rm -p 3000:80 zettacio/lhft-web-gui:dev
docker run -d -it --rm -p 8765:8765 zettacio/lhft-server:prod
```
and navigate to [localhost:3000](http://localhost:3000)


To run individually the components from the source please check in their own section

## [Backend](./backend/README.md)

## [Frontend](./frontend/README.md)


## Publish

To publish changes run 
```sh
make publish
```
