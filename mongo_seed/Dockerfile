FROM mongo

WORKDIR /seed
COPY init.json ./init.json
CMD mongoimport --host mongo --db nodejs_api_dev --collection Employee --type json --file ./init.json --jsonArray
