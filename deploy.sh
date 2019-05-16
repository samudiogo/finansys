#/binbash
#upload files
aws s3 cp ./dist/finansys/ s3://finansys.sdtech.com.br/  --recursive --acl public-read
