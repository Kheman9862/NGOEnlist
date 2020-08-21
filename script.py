import os
os.system('mongoimport')
dir = "public/data"
for file in os.listdir(dir):
    print(file)
    os.system('mongofiles -d NgoEnlist put logos/' + str(file))

os.system('mongoimport --db NgoEnlist --collection Events --type csv --file "Dataset.csv" --headerline')
