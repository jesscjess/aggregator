## Description

Hello hello, welcome to my simple data aggregator. I decided to use NestJS since I've been working with it
recently and I could spin up a service quickly and elegantly.

I decided to aggregate the data first and put it into a JSON file that I could reference so that the requests
would be quicker. Please see the `Running the app` section for commands.

Assumptions:
- If I receive and endTime of 2023-07-10T15:30:00, I will still include the bucket for 2023-07-10T15:00:00.
- Unless start time starts on the hour then I will start my request at the top of the next hour.
- To protect against crazy test data I am only allowing the difference between start & end to be 24 hours.


## Installation

```bash
$ npm install
```

## Running the app

```bash
# IMPORTANT: must run this command first
# this step aggregates the data, it takes a little while
# but it makes the requests a lot faster
$ npm run aggregate-data
# watch mode
$ npm run start:dev
```

## Calling the service

```bash
# example call to service.
$ curl 'localhost:3000/b4f9279a0196e40632e947dd1a88e857?start=2021-03-03T11:00:00.000Z&end=2021-03-03T21:00:00.000Z'
```

## License

Nest is [MIT licensed](LICENSE).
