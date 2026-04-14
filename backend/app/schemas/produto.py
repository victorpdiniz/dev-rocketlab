from pydantic import BaseModel
from typing import Optional

# O que é comum em todos os estados do produto
class ProdutoBase(BaseModel):
    nome_produto: str
    categoria_produto: str
    peso_produto_gramas: float
    comprimento_centimetros: float
    altura_centimetros: float
    largura_centimetros: float

# Usado para criar novos produtos (POST)
class ProdutoCreate(ProdutoBase):
    id_produto: str

# Usado para atualizar (PUT) - tudo é opcional aqui
class ProdutoUpdate(BaseModel):
    nome_produto: Optional[str] = None
    categoria_produto: Optional[str] = None
    peso_produto_gramas: Optional[float] = None

# O que o Gerente vê na lista (GET) - inclui os cálculos de performance
class ProdutoSaida(ProdutoBase):
    id_produto: str
    total_vendas: int
    media_avaliacoes: float

    class Config:
        from_attributes = True