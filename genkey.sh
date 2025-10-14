#!/bin/bash
# Regenerate certificates and configure truststores for IDS Reference Testbed
set -e  # Exit on any error

# Usage function
usage() {
    echo "Usage: $0 [mode]"
    echo "Modes:"
    echo "  full      - Execute complete script (default)"
    echo "  daps      - CA, subCA and DAPS certificates only"
    echo "  broker    - Broker certificates and keystore only"
    echo "  combined  - DAPS + Broker (daps + broker)"
    echo "  connector - Add new connector (requires connector name as second parameter, optional IP address as third parameter)"
    echo ""
    echo "Examples:"
    echo "  $0 full"
    echo "  $0 daps"
    echo "  $0 broker"
    echo "  $0 combined"
    echo "  $0 connector connectorC"
    echo "  $0 connector connectorC 192.168.1.100"
    exit 1
}

# Configuration
ROOT_DIR=/home/ec2-user/IDS-testbed
SSL_DIR=data-cfssl
SERVER_ADDR=127.0.0.1
MODE=${1:-full}

# Validate mode
case "$MODE" in
    full|daps|broker|combined|connector)
        ;;
    *)
        echo "ERROR: Invalid mode '$MODE'"
        usage
        ;;
esac

# For connector mode, validate connector name and optional IP
if [ "$MODE" = "connector" ]; then
    if [ -z "$2" ]; then
        echo "ERROR: Connector name required for connector mode"
        usage
    fi
    CONNECTOR_NAME=$2
    CONNECTOR_IP=$3  # Optional IP address
fi

echo "Starting certificate regeneration process in '$MODE' mode..."

# Function: Setup PKI (always needed)
setup_pki() {
    echo "Setting up PKI infrastructure..."
    cd $ROOT_DIR/CertificateAuthority
    [ -d "$SSL_DIR" ] && rm -rf "$SSL_DIR"
    sh setup_PKI.sh $SSL_DIR
    
    if [ ! -d "$SSL_DIR/certs" ]; then
        echo "ERROR: Certificate generation failed - certs directory not found"
        exit 1
    fi
}

# Function: Process CA and subCA certificates
process_ca_certificates() {
    echo "Processing CA and subCA certificates..."
    cd $ROOT_DIR/CertificateAuthority/$SSL_DIR/ca
    openssl pkcs12 -export -out ca.p12 -in ca.pem -inkey ca-key.pem -passout pass:password
    openssl pkcs12 -in ca.p12 -clcerts -nokeys -out ca.crt -passin pass:password
    openssl pkcs12 -in ca.p12 -out ca.cert -nokeys -nodes -passin pass:password
    cp ca-key.pem ca.key
    
    cd $ROOT_DIR/CertificateAuthority/$SSL_DIR/subca
    openssl pkcs12 -export -out subca.p12 -in subca.pem -inkey subca-key.pem -passout pass:password
    openssl pkcs12 -in subca.p12 -clcerts -nokeys -out subca.crt -passin pass:password
    openssl pkcs12 -in subca.p12 -out subca.cert -nokeys -nodes -passin pass:password
    cp subca-key.pem subca.key
}

# Function: Process DAPS certificates
process_daps_certificates() {
    echo "Processing DAPS certificates..."
    cd $ROOT_DIR/CertificateAuthority/$SSL_DIR/certs
    
    # DAPS certificates
    openssl pkcs12 -export -out daps.p12 -in daps.pem -inkey daps-key.pem -passout pass:password
    openssl pkcs12 -in daps.p12 -clcerts -nokeys -out daps.crt -passin pass:password
    openssl pkcs12 -in daps.p12 -out daps.cert -nokeys -nodes -passin pass:password
    cp daps-key.pem daps.key
    
    # Copy DAPS certificates
    cp daps.cert $ROOT_DIR/DAPS/keys/TLS/daps.cert
    cp daps.key $ROOT_DIR/DAPS/keys/TLS/daps.key
    cp daps.key $ROOT_DIR/DAPS/keys/omejdn/omejdn.key
}

# Function: Process broker certificates
process_broker_certificates() {
    echo "Processing broker certificates..."
    cd $ROOT_DIR/CertificateAuthority/$SSL_DIR/certs
    
    # Broker certificates
    openssl pkcs12 -export -out broker.p12 -in broker.pem -inkey broker-key.pem -passout pass:password
    openssl pkcs12 -in broker.p12 -clcerts -nokeys -out broker.crt -passin pass:password
    openssl pkcs12 -in broker.p12 -out broker.cert -nokeys -nodes -passin pass:password
    cp broker-key.pem broker.key
    
    # Create broker keystore
    rm -f $ROOT_DIR/MetadataBroker/isstbroker-keystore.jks
    keytool -importkeystore -srckeystore broker.p12 -srcstoretype PKCS12 -srcstorepass password -destkeystore $ROOT_DIR/MetadataBroker/isstbroker-keystore.jks -deststoretype JKS -deststorepass password -noprompt
    
    # Copy broker certificates
    cp broker.cert $ROOT_DIR/DAPS/keys/broker.cert
    cp broker.key $ROOT_DIR/MetadataBroker/server.key
    cp broker.crt $ROOT_DIR/MetadataBroker/server.crt
}

# Function: Process connector certificates (for full mode)
process_connector_certificates() {
    echo "Processing connector certificates..."
    cd $ROOT_DIR/CertificateAuthority/$SSL_DIR/certs
    
    # ConnectorA certificates
    openssl pkcs12 -export -out connectorA.p12 -in connectorA.pem -inkey connectorA-key.pem -passout pass:password
    openssl pkcs12 -in connectorA.p12 -clcerts -nokeys -out connectorA.crt -passin pass:password
    openssl pkcs12 -in connectorA.p12 -out connectorA.cert -nokeys -nodes -passin pass:password
    cp connectorA-key.pem connectorA.key
    
    # ConnectorB certificates
    openssl pkcs12 -export -out connectorB.p12 -in connectorB.pem -inkey connectorB-key.pem -passout pass:password
    openssl pkcs12 -in connectorB.p12 -clcerts -nokeys -out connectorB.crt -passin pass:password
    openssl pkcs12 -in connectorB.p12 -out connectorB.cert -nokeys -nodes -passin pass:password
    cp connectorB-key.pem connectorB.key
    

    
    # Copy connector certificates
    cp connectorA.cert $ROOT_DIR/DAPS/keys/connectorA.cert
    cp connectorB.cert $ROOT_DIR/DAPS/keys/connectorB.cert
    cp connectorA.p12 $ROOT_DIR/DataspaceConnectorA/conf/connectorA.p12
    cp connectorB.p12 $ROOT_DIR/DataspaceConnectorB/conf/connectorB.p12
}

# Function: Create truststores
create_truststores() {
    echo "Creating truststores..."
    rm -f $ROOT_DIR/DataspaceConnectorA/conf/truststore.p12
    rm -f $ROOT_DIR/DataspaceConnectorB/conf/truststore.p12
    
    keytool -import -alias testbedca -file $ROOT_DIR/CertificateAuthority/$SSL_DIR/ca/ca.crt -storetype PKCS12 -keystore $ROOT_DIR/DataspaceConnectorA/conf/truststore.p12 -storepass password -noprompt
    keytool -import -alias testbedsubca -file $ROOT_DIR/CertificateAuthority/$SSL_DIR/subca/subca.crt -storetype PKCS12 -keystore $ROOT_DIR/DataspaceConnectorA/conf/truststore.p12 -storepass password -noprompt
    keytool -import -alias testbedca -file $ROOT_DIR/CertificateAuthority/$SSL_DIR/ca/ca.crt -storetype PKCS12 -keystore $ROOT_DIR/DataspaceConnectorB/conf/truststore.p12 -storepass password -noprompt
    keytool -import -alias testbedsubca -file $ROOT_DIR/CertificateAuthority/$SSL_DIR/subca/subca.crt -storetype PKCS12 -keystore $ROOT_DIR/DataspaceConnectorB/conf/truststore.p12 -storepass password -noprompt
}

# Function: Register with DAPS
register_daps() {
    cd $ROOT_DIR/DAPS
    case "$MODE" in
        full)
            rm -f keys/clients/*.cert
            echo "---" > config/clients.yml

            sh ./register_connector.sh broker
            sh ./register_connector.sh connectorA
            sh ./register_connector.sh connectorB
            ;;
        daps)
            rm -f keys/clients/*.cert
            echo "---" > config/clients.yml
            # DAPS only - no registration needed
            ;;
        broker)
            sh ./register_connector.sh broker
            ;;
        combined)
            sh ./register_connector.sh broker
            ;;
        connector)
            sh ./register_connector.sh "$CONNECTOR_NAME"
            ;;
    esac
}

# Function: Add new connector (from add-connector.sh logic)
add_connector() {
    echo "Adding new connector: $CONNECTOR_NAME"
    
    # Check if configuration file exists, create if not
    if [ ! -f "$ROOT_DIR/CertificateAuthority/pkiInput/${CONNECTOR_NAME}.json" ]; then
        echo "Creating configuration file for $CONNECTOR_NAME"
        
        cat > "$ROOT_DIR/CertificateAuthority/pkiInput/${CONNECTOR_NAME}.json" <<EOF
{
  "CN": "Connector ${CONNECTOR_NAME^^}",
  "key": {
    "algo": "rsa",
    "size": 2048
  },
  "names": [
  {
    "C": "DE",
    "L": "Dortmund",
    "O": "IDSA",
    "OU": "IDS Reference Testbed"
  }
  ],
  "hosts": [
    "localhost",
    "${CONNECTOR_NAME,,}",
    "127.0.0.1"$([ -n "$CONNECTOR_IP" ] && echo ",")
    $([ -n "$CONNECTOR_IP" ] && echo "\"$CONNECTOR_IP\"")
  ]
}
EOF
    else
        echo "Configuration file already exists for $CONNECTOR_NAME, skipping creation"
    fi

    # Generate certificate for new connector
    cd "$ROOT_DIR/CertificateAuthority/$SSL_DIR/certs"
    
    cfssl genkey "$ROOT_DIR/CertificateAuthority/pkiInput/${CONNECTOR_NAME}.json" | cfssljson -bare "$CONNECTOR_NAME"
    cfssl sign -ca "$ROOT_DIR/CertificateAuthority/$SSL_DIR/subca/subca.pem" \
        -ca-key "$ROOT_DIR/CertificateAuthority/$SSL_DIR/subca/subca-key.pem" \
        -db-config "$ROOT_DIR/CertificateAuthority/$SSL_DIR/ocsp/sqlite_db_components.json" \
        --config "$ROOT_DIR/CertificateAuthority/pkiInput/ca-config.json" \
        -profile "component" "${CONNECTOR_NAME}.csr" | cfssljson -bare "$CONNECTOR_NAME"
    
    # Convert to required formats
    openssl pkcs12 -export -out "${CONNECTOR_NAME}.p12" -in "${CONNECTOR_NAME}.pem" -inkey "${CONNECTOR_NAME}-key.pem" -passout pass:password
    openssl pkcs12 -in "${CONNECTOR_NAME}.p12" -clcerts -nokeys -out "${CONNECTOR_NAME}.crt" -passin pass:password
    openssl pkcs12 -in "${CONNECTOR_NAME}.p12" -out "${CONNECTOR_NAME}.cert" -nokeys -nodes -passin pass:password
    cp "${CONNECTOR_NAME}-key.pem" "${CONNECTOR_NAME}.key"
    
    # Create dedicated certificate directory
    CERT_DIR="$ROOT_DIR/Certificates-${CONNECTOR_NAME}"
    mkdir -p "$CERT_DIR"
    
    cp "${CONNECTOR_NAME}.p12" "$CERT_DIR/connector.p12"
    cp "${CONNECTOR_NAME}.cert" "$CERT_DIR/connector.cert"
    cp "${CONNECTOR_NAME}.crt" "$CERT_DIR/connector.crt"
    cp "${CONNECTOR_NAME}.key" "$CERT_DIR/connector.key"
    cp "${CONNECTOR_NAME}.pem" "$CERT_DIR/connector.pem"
    
    # Create truststore in certificate directory
    keytool -import -alias testbedca -file "$ROOT_DIR/CertificateAuthority/$SSL_DIR/ca/ca.crt" -storetype PKCS12 -keystore "$CERT_DIR/truststore.p12" -storepass password -noprompt
    keytool -import -alias testbedsubca -file "$ROOT_DIR/CertificateAuthority/$SSL_DIR/subca/subca.crt" -storetype PKCS12 -keystore "$CERT_DIR/truststore.p12" -storepass password -noprompt

    chmod 666 "$CERT_DIR/connector.p12"
    chmod 666 "$CERT_DIR/connector.cert"
    chmod 666 "$CERT_DIR/connector.crt"
    chmod 666 "$CERT_DIR/connector.key"
    chmod 666 "$CERT_DIR/connector.pem"
    chmod 666 "$CERT_DIR/truststore.p12"
    
    # Copy certificate to DAPS for registration
    cp "${CONNECTOR_NAME}.cert" "$ROOT_DIR/DAPS/keys/${CONNECTOR_NAME}.cert"
    
    echo "Connector $CONNECTOR_NAME added successfully!"
    echo "Certificate directory created: $CERT_DIR"
}

# Function: Verify certificates
verify_certificates() {
    echo "Verifying certificate generation..."
    
    case "$MODE" in
        full)
            for cert in broker connectorA connectorB; do
                if [ ! -f "$ROOT_DIR/DAPS/keys/${cert}.cert" ]; then
                    echo "ERROR: Missing certificate: $ROOT_DIR/DAPS/keys/${cert}.cert"
                    exit 1
                fi
            done
            if [ ! -f "$ROOT_DIR/MetadataBroker/isstbroker-keystore.jks" ]; then
                echo "ERROR: Missing broker keystore"
                exit 1
            fi
            ;;
        daps)
            if [ ! -f "$ROOT_DIR/DAPS/keys/TLS/daps.cert" ]; then
                echo "ERROR: Missing DAPS certificate"
                exit 1
            fi
            ;;
        broker)
            if [ ! -f "$ROOT_DIR/DAPS/keys/broker.cert" ]; then
                echo "ERROR: Missing broker certificate"
                exit 1
            fi
            if [ ! -f "$ROOT_DIR/MetadataBroker/isstbroker-keystore.jks" ]; then
                echo "ERROR: Missing broker keystore"
                exit 1
            fi
            ;;
        combined)
            if [ ! -f "$ROOT_DIR/DAPS/keys/TLS/daps.cert" ] || [ ! -f "$ROOT_DIR/DAPS/keys/broker.cert" ]; then
                echo "ERROR: Missing DAPS or broker certificates"
                exit 1
            fi
            ;;
        connector)
            if [ ! -f "$ROOT_DIR/DAPS/keys/${CONNECTOR_NAME}.cert" ]; then
                echo "ERROR: Missing connector certificate: $CONNECTOR_NAME"
                exit 1
            fi
            ;;
    esac
}

# Main execution logic
case "$MODE" in
    full)
        setup_pki
        process_ca_certificates
        process_daps_certificates
        process_broker_certificates
        process_connector_certificates
        create_truststores
        register_daps
        verify_certificates
        echo "Full certificate regeneration completed successfully!"
        ;;
    daps)
        setup_pki
        process_ca_certificates
        process_daps_certificates
        verify_certificates
        echo "DAPS certificate generation completed successfully!"
        ;;
    broker)
        setup_pki
        process_ca_certificates
        process_broker_certificates
        register_daps
        verify_certificates
        echo "Broker certificate generation completed successfully!"
        ;;
    combined)
        setup_pki
        process_ca_certificates
        process_daps_certificates
        process_broker_certificates
        register_daps
        verify_certificates
        echo "Combined DAPS+Broker certificate generation completed successfully!"
        ;;
    connector)
        # For connector mode, we need existing PKI
        if [ ! -d "$ROOT_DIR/CertificateAuthority/$SSL_DIR" ]; then
            echo "ERROR: PKI not found. Run with 'daps' or 'full' mode first."
            exit 1
        fi
        add_connector
        register_daps
        verify_certificates
        echo "Connector $CONNECTOR_NAME added successfully!"
        ;;
esac

echo "Operation completed. You can restart containers with: sudo docker compose down && sudo docker compose up -d"