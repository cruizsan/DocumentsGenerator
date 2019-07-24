# DocumentsGenerator
Generate documents (docx or pdf (zip)) from docx template

### Requirements
* libreoffice
* unoconv
* nodejs
* npm

### Docker
build with docker (easy)
```
git clone https://github.com/cruizsan/DocumentsGenerator.git
cd DocumentsGenerator;

# not mandatory
# write your.env file now

docker image build -t documents-generator .
# or you can see ./build-docker-image.sh

docker run -p 8080:8080 documents-generator
```

by default write into sqlite,
if you want to use mysql put some env variable or create .env file
```
# SQLITE
TYPEORM_LOGGING=true
TYPEORM_MIGRATIONS_RUN=true
TYPEORM_SYNCHRONIZE=true
PORT=8080

# MYSQL
#TYPEORM_HOST=<host>
#TYPEORM_USERNAME=<username>
#TYPEORM_PASSWORD=<passwd>
#TYPEORM_DATABASE=<database>
#TYPEORM_PORT=<port>
#TYPEORM_LOGGING=<true/false>
#TYPEORM_MIGRATIONS_RUN=<true/false>
#TYPEORM_SYNCHRONIZE=<true/false>
#TYPEORM_TYPE=mysql
#PORT=8081

```

### Examples
Api endpoints

```
POST /documents
curl -X POST http://localhost:8454/documents -F file=@test.docx
$>
{
    "name": "3a423611e1bd0bfcebe004b223efaae1",
    "originalname": "test.docx",
    "path": "files/3a423611e1bd0bfcebe004b223efaae1",
    "id": 1
}
<$
```

```
GET /documents
curl -X GET http://localhost:8080/documents
$>
[
    {
        "id": 1,
        "name": "3a423611e1bd0bfcebe004b223efaae1",
        "originalname": "test.docx",
        "path": "files/3a423611e1bd0bfcebe004b223efaae1"
    }
]
<$
```

```
GET /documents/:id
curl -X GET http://localhost:8888/documents/1
$>
{
    "id": 1,
    "name": "3a423611e1bd0bfcebe004b223efaae1",
    "originalname": "test.docx",
    "path": "files/3a423611e1bd0bfcebe004b223efaae1"
}
<$
```

```
POST /documents/generate
curl -X POST \
  http://localhost:8888/documents/generate \
  -d '{
	"template": "3a423611e1bd0bfcebe004b223efaae1",
	"names": "simple-test.pdf",
	"data": {}
}'

$>
<Binary pdf Data (file)>
<$
```

```
POST /documents/generate
curl -X POST \
  http://localhost:8888/documents/generate \
  -d '{
	"template": "3a423611e1bd0bfcebe004b223efaae1",
	"names": "simple-test.docx",
	"data": {}
}'

$>
<Binary docx Data (file)>
<$
```

```
POST /documents/generate
curl -X POST \
  http://localhost:8888/documents/generate \
  -d '{
	"template": "3a423611e1bd0bfcebe004b223efaae1",
	"names": ["simple-test.docx","simple-test.pdf"],
	"data": [{},{}]
}'

$>
<Binary zip Data (file)>
<$
```

```
DELETE /documents/:id
curl -X DELETE http://localhost:8888/documents/1 
$>
{
    "name": "3a423611e1bd0bfcebe004b223efaae1",
    "originalname": "test.docx",
    "path": "files/3a423611e1bd0bfcebe004b223efaae1"
}
<$
```

### Credits
```
https://github.com/nestjs/nest
https://github.com/sindresorhus/temp-write
https://github.com/ryanhanwu/Unoconv-Promise
https://github.com/Stuk/jszip
https://github.com/guigrpa/docx-templates
```
