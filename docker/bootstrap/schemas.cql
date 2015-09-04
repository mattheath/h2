DROP KEYSPACE IF EXISTS login;
DROP KEYSPACE IF EXISTS configservice;
DROP KEYSPACE IF EXISTS binding;
DROP KEYSPACE IF EXISTS playgroundservice;

CREATE KEYSPACE login WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE login."userSessions" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login."endpointAuths" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login.sessions (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login."userLoginIndex" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login."usersIndexIndex" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login."usersIndex" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login."expiredSessions" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login.admins (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE login.users (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE KEYSPACE configservice WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE configservice.audit (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE configservice."auditService" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE configservice."auditServiceIndex" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE configservice."auditIndex" (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE TABLE configservice.configservice (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

use configservice;

insert into configservice ( key, column1, value) values ( textasblob('H2:BASE'), textasblob('body'), textasblob('{"hailo":{"service":{"authentication":{"publicKey":"/opt/hailo/login-service/public-key"},"cruftflake":{"timeout":"20ms","servers":["cruftflake:5599"]},"elasticsearch":{"attempts":2,"timeout":3000,"hosts":["elasticsearch:9200"]},"instrumentation":{"statsd":{"enabled":true,"port":8125,"host":"instrumentation"}},"trace":{"columnFamily":"trace","hosts":["trace"],"keyspace":"trace"},"cassandra":{"defaults":{"maxRetries":5,"recvTimeout":"1s","sendTimeout":"1s","writeConsistencyLevel":"ONE","readConsistencyLevel":"ONE"},"hosts":["cassandra:9160"]},"memcache":{"timeouts":{"pollTimeout":"250ms","sendRecvTimeout":"100ms","connectTimeout":"1s","clusterTimeout":"1s","opTimeoutSleep":"20ms"},"servers":["memcache:1211"]},"nsq":{"retry":{"delay":"5s","maxAttempts":30},"pubHosts":["nsqd:4150"],"subHosts":["nsqd:4150"],"writeCl":"ONE","connectionTimeout":"300ms","readWriteTimeout":"300ms","readWaitTimeout":"15s","nsqlookupdSeeds":["nsqlookupd:4161"],"disableLookupd":true},"zookeeper":{"recvTimeout":"200ms","hosts":["zookeeper:2181"]}}}}'));

CREATE KEYSPACE binding WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE binding.binding_rules (
    key blob,
    column1 blob,
    value blob,
    PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE
    AND CLUSTERING ORDER BY (column1 ASC)
    AND caching = '{"keys":"ALL", "rows_per_partition":"NONE"}'
    AND comment = ''
    AND compaction = {'min_threshold': '4', 'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32'}
    AND compression = {'sstable_compression': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = 'NONE';

CREATE KEYSPACE playgroundservice WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}  AND durable_writes = true;

CREATE TABLE playgroundservice.scripts (
  key blob,
  column1 blob,
  value blob,
  PRIMARY KEY (key, column1)
) WITH COMPACT STORAGE AND
  bloom_filter_fp_chance=0.010000 AND
  caching='{"keys":"ALL", "rows_per_partition":"NONE"}' AND
  comment='' AND
  dclocal_read_repair_chance=0.000000 AND
  gc_grace_seconds=864000 AND
  read_repair_chance=0.100000 AND
  default_time_to_live=0 AND
  speculative_retry='NONE' AND
  memtable_flush_period_in_ms=0 AND
  compaction={'class': 'SizeTieredCompactionStrategy'} AND
  compression={'sstable_compression': 'LZ4Compressor'};

insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('app'), textasblob('ADMIN'));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('createdTimestamp'), bigintasblob(1440674417000));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('ids'), textasblob('[]'));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('password'), textasblob('$2a$10$3Tal3aXTzHf5WfOCOx4eCOaSftVr6NW1QkhGvLT0smqUBE075lnu2'));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('passwordChangeTimestamp'), bigintasblob(1540674417000));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('passwordHistory'), textasblob('[]'));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('roles'), textasblob('["ADMIN"]'));
insert into login.users (key, column1, value) values(0x41444d494ec2a761646d696e, textasblob('uid'), textasblob('admin'));
