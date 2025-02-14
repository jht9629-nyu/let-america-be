#!/bin/bash
cd ${0%/*}

# Produce a release build to main branch

cd ..
quiet=--quiet

# deploy to github pages
#
# merge branch main in to branch release
#

# ./moLib/bin/build.sh --src ./ --files src,README.md --prod $quiet

git add . 
git commit $quiet -m "`cat gen/build_ver.txt`"
git push $quiet

# switch to release, and merge in main
git checkout release $quiet
git merge main $quiet -m "`cat gen/build_ver.txt`"
git push $quiet

# switch back to main
git checkout main $quiet

echo
echo "build `cat gen/build_ver.txt`"

