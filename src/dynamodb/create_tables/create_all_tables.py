import time
import create_table_admins as admins
import create_table_config as config
import create_table_participants as participants
import create_table_persons as persons
import create_table_polls as polls

admins.create_table_admins()

time.sleep(1)
config.create_table_config()

time.sleep(1)
participants.create_table_participants()

time.sleep(1)
persons.create_table_persons()

time.sleep(1)
time.create_table_time()