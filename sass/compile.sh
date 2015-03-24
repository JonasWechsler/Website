ROOT=$(pwd)
DEST=$(cd ../public/stylesheets/; pwd)
for file in *.scss; do
    destfile="$DEST/$file"
    sass "$file" "$destfile"
    mv "$destfile" "${destfile%.scss}.css"
    echo "$file > $destfile > ${destfile%.scss}.css"
done
