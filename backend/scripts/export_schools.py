from db import SessionLocal
from crud import list_schools
import csv, os

s = SessionLocal()
rows = list_schools(s, skip=0, limit=100000)
os.makedirs('exports', exist_ok=True)
path = os.path.join('exports','schools_export.csv')
with open(path,'w',newline='',encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['id','name','type','curriculum','address','latitude','longitude','contact','website','status'])
    for r in rows:
        writer.writerow([r.id, r.name, r.type, r.curriculum, r.address, r.latitude, r.longitude, r.contact, r.website, r.status])

print('exported=', path)
print('sample_count=', min(10, len(rows)))
for r in rows[:10]:
    print(r.id, '|', r.name, '|', r.website)
