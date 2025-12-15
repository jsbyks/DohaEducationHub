from main import app
paths=[r.path for r in app.routes]
for p in sorted(paths):
    print(p)
