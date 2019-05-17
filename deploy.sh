#/binbash
#build project
ng b --prod
echo "project builded. uploloading..."
#upload files
aws s3 cp ./dist/finansys/ s3://finansys.sdtech.com.br/  --recursive --acl public-read
echo "project deployed at http://finansys.sdtech.com.br sucessfully! 🚀 🚀"
