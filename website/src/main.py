from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from .routers import root, users

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(root.router, prefix="", default_response_class=HTMLResponse)
app.include_router(users.router, prefix="/users", default_response_class=HTMLResponse)
