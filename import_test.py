import csv
import psycopg2
from config import Config

import_file = "/src/TestData.txt"

connection_string= "dbname={db} user={user} host={host} password={password}".\
    format(db=Config.POSTGRES_DB,user=Config.POSTGRES_USER, host=Config.POSTGRES_HOSTNAME,
           password=Config.POSTGRES_PASSWORD)

# use our connection values to establish a connection
conn = psycopg2.connect(connection_string)
# create a psycopg2 cursor that can execute queries
cursor = conn.cursor()


with open(import_file, 'r') as file:
    reader = csv.DictReader(file, delimiter=" ")
    data = [r for r in reader]
    for i in data:
        cursor.execute("INSERT INTO metrics (model, realization, faultblock, zone, grv, nrv, npv, hcpv, stoiip) "
                       "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                       (i['Model'], i['Realization'], i['Faultblock'], i['Zone'], i['GRV'],
                        i['NRV'], i['NPV'], i['HCPV'], i['STOIIP']))
        conn.commit()

cursor.close()
conn.close()
