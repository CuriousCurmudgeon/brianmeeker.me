---
title: "Debugging Transaction Issues In MariaDB"
description: "Transactions are great until they aren't. I was reminded of this the past couple of days while trying to figure out why some code I was refactoring was all of a sudden timing out."
date: "2022-06-07"
tags: 
  - "mariadb"
---

Transactions are great until they aren't. I was reminded of this the past couple of days while trying to figure out why some code I was refactoring was all of a sudden timing out.

# The Problem

At Husmus, I've been on a crusade to simplify some parts of our architecture by getting rid of some low value services in favor of a well structured monolith. One advantage of this is that DB changes that previously could not be in a transaction now can be because all the work can be done with one connection.

This time though, I started seeing strange timeouts. The action would succeed the first time, but fail every time after that.

# The Hunch

My immediate hunch was that it was something transaction related. The problem with my hunch though was that I didn't have a clue how to debug transaction issues with MariaDB. That meant it was time to start digging.

The first command I found to try was [SHOW ENGINE INNODB STATUS](https://mariadb.com/kb/en/show-engine-innodb-status/). This gave me a lot of information, but the relevant part for me was this.

```
---TRANSACTION 151056, ACTIVE 15 sec inserting
mysql tables in use 1, locked 1
LOCK WAIT 4 lock struct(s), heap size 1128, 1 row lock(s), undo log entries 2
MariaDB thread id 2081, OS thread handle 139636657866496, query id 109252 172.18.0.1 dotnet_user Update
INSERT INTO Activation (`AccountId`, `Token`) VALUES (175, 'qnAqVdp7')
Trx read view will not see trx with id >= 151056, sees < 151049
------- TRX HAS BEEN WAITING 13265145 ns FOR THIS LOCK TO BE GRANTED:
RECORD LOCKS space id 568 page no 3 n bits 8 index PRIMARY of table `hus`.`Activation` trx id 151056 lock_mode X insert intention waiting
Record lock, heap no 1 PHYSICAL RECORD: n_fields 1; compact format; info bits 0
 0: len 8; hex 0000000000000001; asc         ;;

------------------
---TRANSACTION (0x7effc0ebca30), not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION (0x7effc0ebb930), not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION (0x7effc0eba830), not started
0 lock struct(s), heap size 1128, 0 row lock(s)
---TRANSACTION 151049, ACTIVE 95 sec
2 lock struct(s), heap size 1128, 5 row lock(s), undo log entries 1
MariaDB thread id 2077, OS thread handle 139636908463872, query id 109010 172.18.0.1 dotnet_user
```

The first section showed that a transaction with ID 151056 was waiting to get a lock. Then at the bottom I saw that transaction 151049 had been been active for **95 seconds** and was locking some resources. This was a huge red flag that I was on the right track.

# The Deep Dive

I had confirmed that it was some sort of transaction issue, but the code I was working on looked fine. It was time to dig deeper. I needed to figure out how to see details of each transaction and each query.

After some digging, I learned about [information_schema.innodb_trx](https://mariadb.com/kb/en/information-schema-innodb_trx-table/). This table shows details about every current transaction. I was consistently able to reproduce the issue and every time I would see one transaction just waiting and locking resources that matched what `SHOW ENGINE INNODB STATUS` was showing.

From there, I wanted to see what queries were executing in that transaction. First, I had to turn on query logging by running

```
SET GLOBAL general_log=1;
SET GLOBAL log_output='TABLE';

SELECT * FROM mysql.general_log ORDER BY event_time DESC LIMIT 200
```

Combined with `information_schema.innodb_trx`, this unlocked all of the mysteries for me. The value of `TRX_MYSQL_THREAD_ID` maps directly to `THREAD_ID` in `mysql.general_log`. Now I could get a list of all queries executed as part of the hanging transaction.

```
-- Get all queries executed by the thread with the
-- uncommitted transaction
SELECT event_time, command_type, argument
FROM mysql.general_log
WHERE thread_id = 183 -- The thread id from information_schema.innodb_trx
ORDER BY event_time
```

This gave the following truncated results.

```
event_time             |command_type|argument            |
-----------------------+------------+--------------------+
2022-06-07 17:18:44.163|Connect     |dotnet_user@172.1...|
2022-06-07 17:18:44.163|Query       |SET NAMES utf8mb4   |
2022-06-07 17:18:44.167|Query       |SELECT * FROM Que...|
2022-06-07 17:18:45.250|Query       |SET NAMES utf8mb4   |
2022-06-07 17:18:45.251|Query       |set session trans...|
2022-06-07 17:18:45.251|Query       |start transaction   |
2022-06-07 17:18:45.253|Query       |UPDATE Activation...|
```

The important bits are the last two lines. We see that a transaction was started and an `UPDATE` executed. Where is the transaction commit though? This was the final clue I needed. I was able to go back to my code and quickly find the transaction that was not being committed. Turns out that this particular bug already existed. It was just my refactoring that exposed it by more efficiently using transactions elsewhere.

# Conclusion

This was one of those bugs where I was ready to throw in the towel. This was supposed to be a quick restructuring of some existing code to make it easier to extend in our next project. The imposter syndrome started to hit pretty hard as I was struggling to figure out how to debug this. Multiple times I was ready to just push the branch off to the side for another day.

I'm glad I stuck with it though. Leveling up my MariaDB skills is important. My days of being a DB wizard are years in my past now and mostly on SQL Server. Demystifying this type of debugging in MariaDB will hopefully pay dividends in the future.
