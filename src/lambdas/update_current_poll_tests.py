import update_current_poll as ucp
import time

response = ucp.update_current_poll({}, None)
print(response)

response = ucp.update_current_poll({
    'admin_name': 'adsas'
}, None)
print(response)

response = ucp.update_current_poll({
    'admin_password': 'asdad'
}, None)
print(response)

time.sleep(1)
response = ucp.update_current_poll({
    'admin_name': 'example',
    'admin_password': 'asdad'
}, None)
print(response)

time.sleep(1)
response = ucp.update_current_poll({
    'admin_name': 'example',
    'admin_password': 'example'
}, None)
print(response)

time.sleep(1)
response = ucp.update_current_poll({
    'admin_name': 'example',
    'admin_password': 'example',
    'max': 'ass'
}, None)
print(response)

time.sleep(1)
response = ucp.update_current_poll({
    'admin_name': 'example',
    'admin_password': 'example',
    'dt': '1542915600000'
}, None)
print(response)

response = ucp.update_current_poll({
    'admin_name': 'example',
    'admin_password': 'example',
    'end': '1553209200000',
}, None)
print(response)

response = ucp.update_current_poll({
    "admin_name": "example",
    "admin_password": "example",
    "title": "something new",
    "desc": "something new",
    "locDesc": "something new",
    "locUrl": "something new",
    "max": "10"
}, None)
print(response)