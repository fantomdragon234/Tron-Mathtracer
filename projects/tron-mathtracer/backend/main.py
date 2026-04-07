from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from parser import parse_expression

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/parse")
async def parse(data: dict):
    expr = data.get("expression", "")
    parsed = parse_expression(expr)
    return {"parsed": parsed}