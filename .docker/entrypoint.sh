#!/bin/bash
yarn --verbose
yarn run typeorm migration:run
yarn run dev
