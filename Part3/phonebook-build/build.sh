#!/bin/bash

FRONTEND_DIR="../UHelsinkiFullStack2022/Part2/phonebook"

rm -rf build && cd "${FRONTEND_DIR}" && npm run build
cd -
cp -r "${FRONTEND_DIR}/build" .
