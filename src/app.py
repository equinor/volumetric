from time import sleep
import os
from sqlalchemy import create_engine
from sqlalchemy import Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
POSTGRES_HOSTNAME = os.environ['DATABASE']
POSTGRES_PASSWD = os.environ['POSTGRES_PASSWORD']
POSTGRES_USER = os.environ['POSTGRES_USER']
POSTGRES_DB = os.environ['POSTGRES_DB']
POSTGRES_PORT = os.environ['DATABASE_PORT']

print("These ENVIRONMENTS are set from docker-compose:")
print("Postgres Hostname: " + POSTGRES_HOSTNAME)
print("Postgres Port: " + POSTGRES_PORT)
print("Postgres Database: " + POSTGRES_DB)
print("Postgres User: " + POSTGRES_USER)
print("Postgres Password: [OMITTED]")

db_string = "postgresql://{username}:{password}@{hostname}:{port}/{database}".format(username=POSTGRES_USER,
                                                                                     password=POSTGRES_PASSWD,
                                                                                     hostname=POSTGRES_HOSTNAME,
                                                                                     port=POSTGRES_PORT,
                                                                                     database=POSTGRES_DB)
DATABASE = create_engine(db_string)
BASE = declarative_base()

class Film(base):
    __tablename__ = 'films'

    title = Column(String, primary_key=True)
    director = Column(String)
    year = Column(String)

Session = sessionmaker(db)
session = Session()

base.metadata.create_all(db)

# Create
doctor_strange = Film(title="Doctor Strange", director="Scott Derrickson", year="2016")
session.add(doctor_strange)
session.commit()

# Read
films = session.query(Film)
for film in films:
    print(film.title)

i = 0
while i < 300:
    print ("Sleeping...ztest 123")
    i += 1
    sleep(10)
