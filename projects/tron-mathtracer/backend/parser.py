import re

def parse_expression(expr: str) -> str:
    expr = expr.strip()
    
    expr = re.sub(r"^\s*(y|f\(x\))\s*=\s*", "", expr)
    
    expr = expr.replace("^", "**")

    funcs = ["sin", "cos", "tan", "log", "sqrt", "abs", "exp", "asin", "acos", "atan", "sinh", "cosh", "tanh", "ceil", "floor", "round"]
    for f in funcs:
        expr = re.sub(rf"(?<!Math\.)\b{f}\(", f"Math.{f}(", expr)

    expr = re.sub(rf"(?<!Math\.)\bpi\b", "Math.PI", expr, flags=re.IGNORECASE)
    expr = re.sub(rf"(?<!Math\.)\be\b(?!x)", "Math.E", expr, flags=re.IGNORECASE)

    expr = re.sub(r"(\d)(x)", r"\1*\2", expr)
    expr = re.sub(r"(x)(\d)", r"\1*\2", expr)
    expr = re.sub(r"(x)(Math)", r"\1*\2", expr)
    expr = re.sub(r"(\))(\()", r"\1*\2", expr)
    expr = re.sub(r"(\d)(\()", r"\1*\2", expr)

    return expr