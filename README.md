# Seedling

## Server

### setup

- create a `.env` file in the server folder, specifying:

```javascript

DATABASE_URL=postgres://user:pass@localhost/dbName  // postgres connection string
PORT=3000  //  port to run the server on should be 3000 for development
FILE_PROVIDER=local  //  either `local` to utilize the file system or `aws` to upload to amazon.

// if FILE_PROVIDER=aws then you must also specify:
AMAZON_ACCESS_KEY=[access token]
AMAZON_SECRET_KEY=[secret key]
AMAZON_BUCKET_NAME=[bucket name]

```

- run `yarn` to install dependencies
- run `yarn start` to start the server


## Native

### setup

- run `yarn` to install dependencies
- run `react-native link` to link native dependencies
- run `yarn start` to start for android development
