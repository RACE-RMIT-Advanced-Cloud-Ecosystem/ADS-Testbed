#!/bin/sh

# Adding key configuration scripts on start up
echo "Configuring Keys"
keytool -delete -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -alias aisec_daps 2>/dev/null || true
keytool -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt -trustcacerts -importcert -alias aisec_daps -file $JAVA_HOME/lib/security/daps.crt

# Original start.sh from https://github.com/International-Data-Spaces-Association/metadata-broker-open-core
echo "Starting Spring boot app"

ARGS="-Djava.security.egd=file:/dev/./urandom -Dsparql.url=${SPARQL_ENDPOINT} -Delasticsearch.hostname=${ELASTICSEARCH_HOSTNAME} "

# Add proxy args
if [ ! -z "$PROXY_HOST" ]; then
    ARGS="${ARGS} -Dhttp.proxyHost=${PROXY_HOST} -Dhttp.proxyPort=${PROXY_PORT-3128}"
    if [ ! -z "$PROXY_USER" ]; then
        ARGS="${ARGS} -Dhttp.proxyUser=${PROXY_USER}"
    fi
    if [ ! -z "$PROXY_PASS" ]; then
        ARGS="${ARGS} -Dhttp.proxyPassword=${PROXY_PASS}"
    fi
fi

# DAPS token validation
if [ ! -z "$DAPS_VALIDATE_INCOMING" ]; then
    ARGS="${ARGS} -Ddaps.validateIncoming=${DAPS_VALIDATE_INCOMING}"
fi

# validate shacl shapes
if [ ! -z "$SHACL_VALIDATION" ]; then
    ARGS="${ARGS} -Dinfomodel.validateWithShacl=${SHACL_VALIDATION}"
fi

# URI of own connector
if [ ! -z "$COMPONENT_URI" ]; then
    ARGS="${ARGS} -Dcomponent.uri=${COMPONENT_URI}"
fi

# URI of own catalog
if [ ! -z "$COMPONENT_CATALOG_URI" ]; then
    ARGS="${ARGS} -Dcomponent.catalogUri=${COMPONENT_CATALOG_URI}"
fi

#JAVAKESTORE
if [ ! -z "$IDENTITY_JAVAKEYSTORE" ]; then
    ARGS="${ARGS} -Dssl.javakeystore=${IDENTITY_JAVAKEYSTORE}"
fi


# Enable debugging
ARGS="${ARGS} -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"

echo "ARGS=${ARGS}"

exec java ${ARGS} -jar /broker-core.jar
