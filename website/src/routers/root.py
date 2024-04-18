from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

templates = Jinja2Templates(directory="src/views/")

router = APIRouter()


@router.get("/")
async def homepage(request: Request):
    return templates.TemplateResponse(
        "root/home.jinja", {"request": request, "title": "Home"}
    )
