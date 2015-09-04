#! /bin/bash

IP=`boot2docker ip`

# Setup C* keyspaces
echo "--- Setup cassandra keyspaces"
cat schemas.cql | cqlsh $IP 9042
