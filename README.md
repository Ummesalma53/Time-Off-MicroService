# Time-Off Management Microservice

A full-lifecycle time-off management microservice built as a technical 
take-home assessment for Wizdaa.

## Overview

This service handles the complete lifecycle of an employee time-off 
request — from submission through approval to balance deduction — with 
attention to the kind of edge cases that break naive implementations in 
production: concurrent updates, race conditions, and integration with 
external HR systems.

## Features

- **Full request lifecycle** — create, approve/reject, and cancel 
  time-off requests, with balance updates tied to each transition
- **Optimistic locking** — prevents race conditions when multiple 
  requests attempt to update the same balance concurrently, instead of 
  silently corrupting data
- **Mock HCM sync layer** — simulates integration with an external Human 
  Capital Management system, the way this service would sync with a real 
  HR platform in production
- **Test coverage** — unit tests covering core business logic (balance 
  calculations, approval flows, locking behavior)
- **CI pipeline** — automated test runs via GitHub Actions on every push

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** SQLite
- **Testing:** Jest (unit + e2e)

## Project Structure

src/ → application source (modules, controllers, services)
test/ → unit and e2e test suites
.github/workflows/ → CI configuration
TRD.md → technical requirements document


## Running Locally

```bash
# install dependencies
npm install

# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Running Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# coverage
npm run test:cov
```

## Why This Project

This was built under a recruitment take-home constraint — a limited 
timeframe to demonstrate not just working CRUD, but production-minded 
engineering decisions: handling concurrency correctly, designing for 
integration with systems you don't control, and shipping with real test 
coverage rather than just a happy-path demo.
