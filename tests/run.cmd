pushd %~dp0
node.exe "..\node_modules\jasmine-node\bin\jasmine-node" --verbose .
popd .
