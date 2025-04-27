## Description

Drug indication API using [Nest](https://github.com/nestjs/nest) framework. The API performs a scraper of the [DailyMed page](https://dailymed.nlm.nih.gov/dailymed/) where it searches for a specific medication and returns the recommendations for that medication using the ICD-10 standard. It uses the AI [Cohere-AI](https://cohere.com/) to manipulate this data as if it were a doctor.

## Project setup

```bash
$ yarn install
```

## Run the project with docker (recommended)

```bash
# just for avoid conflicts with previouly containers
$ sudo docker-compose down

# up the containers
$ sudo docker-compose up --build

```

## Run the project without docker
Remember to fill .env information

```bash
# develop environment
$ yarn start:dev

```

## Run tests

```bash
# unit tests
$ yarn run test

```


## API documentation

Check out the [API documentation](https://www.postman.com/webcandidate/drug-indication/collection/x5irkji/drugs-nestjs-api) for more information.

## Stay in touch

- Author - [Eric Pereira](https://www.linkedin.com/in/eric-pereira-dev/)
