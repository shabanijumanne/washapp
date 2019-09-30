import pymongo
from temba_client.v2 import TembaClient

client= pymongo.MongoClient('mongodb+srv://swash_user:c53eTVjEFf4HAVUz@swash-gbake.gcp.mongodb.net/swash?retryWrites=false')
myrapidb= client["swash"]
mycolumn= myrapidb["responses"]

client = TembaClient('rapidpro.io', '1260b9d9dc6634c28f7c223cc52eafa87547d65b')

runs = client.get_runs(flow ='ae8b64d6-eb74-4f02-baa8-6d7604154a05').all()
print(runs)
for i in list(range(len(runs))):
    # print(runs[i].id)
    
    try:
        myresponse = {
             "id_rapid": runs[i].id,
             "disabled_latrines": runs[i].values['disabled_latrines'].value,
             "Hygiene_education": runs[i].values['hygiene_education'].value,
              "Latrines_availability": runs[i].values['latrines_availability'].value,
              "number_of_boys_latrines": runs[i].values['number_of_boys_latrines'].value,
              "number_of_girls_latrines": runs[i].values['number_of_girls_latrines'].value,
              "water_supply": runs[i].values['water_supply'].value, 
        }
        prints(id_rapid)
        mycolumn.insert_one(myresponse)
        # bypass_document_validation=False, session=None)
        print("inserted")
    except:
        print("Something went wrong")
