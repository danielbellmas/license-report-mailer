# Colors
GREEN="\033[0;32m"
BLUE="\033[0;34m"
END_COLOR="\033[0m"

source .bashrc

CSV_PATH=$PWD/csv


for FOLDER in $FOLDERS
do
    echo "${BLUE}Processing $FOLDER${END_COLOR}"

    cd "$BASE_PATH$FOLDER"  && license-report --output=csv > $CSV_PATH/$FOLDER.csv

    echo "${GREEN}$FOLDER Done${END_COLOR}\n"
done


