curl -sS -X DELETE http://localhost:8083/connectors/pg-outbox
curl -s -X PUT http://localhost:8083/connectors/pg-outbox/config \
  -H "Content-Type: application/json" \
  -d '{
    "connector.class": "io.debezium.connector.postgresql.PostgresConnector",
    "tasks.max": "1",
    "database.hostname": "postgres",
    "database.port": "5432",
    "database.user": "postgres",
    "database.password": "postgres",
    "database.dbname": "tokens",



    "plugin.name": "pgoutput",
    "slot.name": "outbox_slot",
    "publication.name": "dbz_outbox_publication",
    "publication.autocreate.mode": "filtered",

    "topic.prefix": "appdb",
    "table.include.list": "public.outbox_event",
    "snapshot.mode": "initial",

    "transforms": "outbox",
    "transforms.outbox.type": "io.debezium.transforms.outbox.EventRouter",
    "transforms.outbox.table.field.event.key": "aggregate_id",
    "transforms.outbox.table.field.timestamp": "created_at",
    "transforms.outbox.route.by.field": "type",
    "transforms.outbox.route.topic.replacement": "${routedByValue}",
    "transforms.outbox.table.expand.json.payload": "true",

    "tombstones.on.delete": "false",
    "include.schema.changes": "false",
    "decimal.handling.mode": "string",
    "time.precision.mode": "adaptive_time_microseconds",
    "slot.drop.on.stop": "false",
    "heartbeat.interval.ms": "10000",
    "errors.log.enable": "true",
    "errors.tolerance": "none"
  }'
