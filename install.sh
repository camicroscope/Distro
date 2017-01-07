git clone https://github.com/camicroscope/DataDockerContainer
git clone https://github.com/camicroscope/LoaderDockerContainer
git clone https://github.com/camicroscope/ViewerDockerContainer

docker build -t camicroscope_data DataDockerContainer
docker build -t camicroscope_loader LoaderDockerContainer
docker build -t camicroscope_viewer ViewerDockerContainer


mkdir img
mkdir data

export CAMIC_IMAGES_DIR=$(echo $(pwd)/img)
export CAMIC_DATA_DIR=$(echo $(pwd)/data)

export CAMIC_BINDAAS_PORT=9099

export CAMIC_KUE_PORT=6000
export CAMIC_MARKUPLOADER_PORT=6001
export CAMIC_DATALOADER_PORT=6002

export CAMIC_VIEWER_PORT=1337


# Run data container
data_container=$(docker run -itd -p $CAMIC_BINDAAS_PORT:9099 -v $CAMIC_IMAGES_DIR:/data/images -v $CAMIC_DATA_DIR:/data/db camicroscope_data)

echo "Started data container: " $data_container
#export CAMIC_DATA_IP=$(docker inspect $data_container | grep IPAddress | cut -d '"' -f 4)
export CAMIC_DATA_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $data_container)
echo $CAMIC_DATA_IP

# Run loader container
dataloader_host="http://"$CAMIC_DATA_IP":9099"
annotations_host="http://"$CAMIC_DATA_IP":9099"

loader_container=$(docker run -itd -p $CAMIC_KUE_PORT:3000 -p $CAMIC_MARKUPLOADER_PORT:3001 -p $CAMIC_DATALOADER_PORT:3002 -v $CAMIC_IMAGES_DIR:/data/images -e "dataloader_host=$(echo $dataloader_host)" -e "annotations_host=$(echo $annotations_host)" camicroscope_loader)
echo "Started loader container: " $loader_container


# Run viewer container
HTML_DIRECTORY=$(pwd)"/ViewerDockerContainer"
docker run -itd -p $CAMIC_VIEWER_PORT:80 -v $HTML_DIRECTORY/html:/var/www/html -v $CAMIC_IMAGES_DIR:/data/images camicroscope_viewer

