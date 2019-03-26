from datetime import datetime

t = '2018/11/22'
dt = datetime.strptime(t + ' 20:40', '%Y/%m/%d %H:%M')
print(dt)
print(int(dt.timestamp()*1000))

name = 'meto-(asdasd)' 
print(name[name.find('(')+1:-1])

persons = {
    "meto": {
        "polls": 1,
        "friends": 2
    }
}

print(persons)
persons["meto"]["polls"] += 1
print(persons)

arr = []
arr.append({
    "asd":1,
    "ass":1,
})

print(arr)