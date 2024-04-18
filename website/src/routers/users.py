from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="src/views/")

router = APIRouter()


@router.get("/login")
async def login(request: Request):
    return templates.TemplateResponse(
        "users/login.jinja", {"request": request, "title": "Login"}
    )


@router.get("/register")
async def register(request: Request):
    return templates.TemplateResponse(
        "users/register.jinja", {"request": request, "title": "Register"}
    )
