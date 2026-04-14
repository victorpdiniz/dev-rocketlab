from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.produto import Produto
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
from app.schemas.produto import ProdutoSaida, ProdutoCreate, ProdutoUpdate

router = APIRouter(prefix="/produtos", tags=["Gerenciamento de Produtos"])

@router.get("/", response_model=list[ProdutoSaida])
def listar_produtos(
    db: Session = Depends(get_db), 
    busca: str = Query(None, description="Busca por nome do produto"),
    skip: int = 0, 
    limit: int = 20
):
    query = db.query(Produto)
    
    if busca:
        query = query.filter(Produto.nome_produto.contains(busca))
    
    produtos = query.offset(skip).limit(limit).all()
    
    res = []
    for p in produtos:
        # 1. Contar Vendas (Desempenho)
        vendas = db.query(ItemPedido).filter(ItemPedido.id_produto == p.id_produto).count()
        
        # 2. Calcular Média de Avaliações
        # Relacionamos Itens -> Pedidos -> Avaliações
        media = db.query(func.avg(AvaliacaoPedido.avaliacao))\
            .join(ItemPedido, ItemPedido.id_pedido == AvaliacaoPedido.id_pedido)\
            .filter(ItemPedido.id_produto == p.id_produto).scalar() or 0.0
            
        res.append({
            **p.__dict__,
            "total_vendas": vendas,
            "media_avaliacoes": round(media, 1)
        })
    return res

@router.post("/", response_model=ProdutoSaida)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    db_prod = Produto(**produto.dict())
    db.add(db_prod)
    db.commit()
    db.refresh(db_prod)
    return {**db_prod.__dict__, "total_vendas": 0, "media_avaliacoes": 0.0}

@router.delete("/{id_produto}")
def remover_produto(id_produto: str, db: Session = Depends(get_db)):
    db_prod = db.query(Produto).filter(Produto.id_produto == id_produto).first()
    if not db_prod:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(db_prod)
    db.commit()
    return {"status": "removido com sucesso"}