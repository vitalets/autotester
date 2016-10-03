#!/usr/bin/env bash

EXPECTED_BRANCH=${1:-master}
BRANCH=$(git rev-parse --abbrev-ref HEAD)
DIRTY=$(git status --porcelain)

if [ $BRANCH != $EXPECTED_BRANCH ]; then
    echo Invalid branch: $BRANCH, expected: $EXPECTED_BRANCH
    exit 1
fi

if [ -n "$DIRTY" ]; then
    echo Dirty state
    echo $DIRTY
    exit 1
fi
