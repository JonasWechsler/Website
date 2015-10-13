ROOT=$(pwd)
DEST=$(cd ../public/stylesheets/; pwd)
write() {
    destfile="$DEST/$1"
    sass "$1" "$destfile"
    mv "$destfile" "${destfile%.scss}.css"
    sed -i "1i/*DO NOT EDIT .css FILES*/" "${destfile%.scss}.css"
    echo "$1 > $destfile > ${destfile%.scss}.css"
}
watch() {
    while inotifywait -e close_write -q $1; do write $1; done
}
for file in *.scss; do watch $file & done
