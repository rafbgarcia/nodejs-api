## Set up and start API server

- `make setup`
- `make start`

MongoDB admin http://localhost:8081/db/nodejs_api_dev/

## Endpoints

- Login (`GET /users/login`)
  - Does not require authentication
  - Returns the `token` to be used on authenticated requests
- Create Employee (`POST /employees`)
- Delete Employee (`DELETE /employees/:id`)
- Employees statistics (`GET /employees/statistics`)
  - Use query params to manipulate the end result
  - e.g. `GET /employees/statistics?columns[]=salary&filters[onContract]=true&groups[]=department`

## Testing

### Automated tests

Run `$ make tests_run`

### Manual tests

#### Setup

- Install Postman
  - https://www.postman.com/downloads/
  - OR `brew install --cask postman`
- Import a collection by Link
  - https://www.getpostman.com/collections/1c83e2d2c5869761cda0

#### Suggested testing flow

1. Test endpoints that require authentication (all but Login)
1. Login with invalid credentials
1. Login with valid credentials

   - Copy the `token` from the response
   - Click on `NodeJS API` > `Authorization`
   - Paste the `token` to the `Value` field
   - Save it (CMD + S)

1. Test `Create Employee`
1. Test `Delete Employee`

   - Visit http://localhost:8081/
   - Go to the Employee collection
   - Copy an Employee `_id` and use as the `:id` param on `/employees/:id`
   - Send the request and make sure the record is deleted from the collection

1. Test `Employee Statistics`

   - Check and uncheck `Query Params` as you wish

