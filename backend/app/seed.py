import pandas as pd
import os
from datetime import datetime
from app.database import SessionLocal, engine
from app.models.produto import Produto
from app.models.consumidor import Consumidor
from app.models.vendedor import Vendedor
from app.models.pedido import Pedido
from app.models.item_pedido import ItemPedido
from app.models.avaliacao_pedido import AvaliacaoPedido
# Se você criou um model para as imagens das categorias:
# from app.models.categoria_imagem import CategoriaImagem 

def format_date(date_str):
    if pd.isna(date_str) or date_str == "":
        return None
    try:
        return pd.to_datetime(date_str)
    except:
        return None

def run_seed():
    db = SessionLocal()
    base_path = os.path.join(os.path.dirname(__file__), "..", "data")

    try:
        # 1. Produtos - TRATANDO NULOS
        print("📦 Populando Produtos...")
        df_prod = pd.read_csv(os.path.join(base_path, "dim_produtos.csv"))
        
        # Preenche categorias vazias com 'Outros' e nomes vazios com 'Produto Sem Nome'
        df_prod['categoria_produto'] = df_prod['categoria_produto'].fillna('Outros')
        df_prod['nome_produto'] = df_prod['nome_produto'].fillna('Produto Sem Nome')
        
        # Preenche medidas numéricas vazias com 0.0 para não quebrar o banco
        medidas = ['peso_produto_gramas', 'comprimento_centimetros', 'altura_centimetros', 'largura_centimetros']
        df_prod[medidas] = df_prod[medidas].fillna(0.0)

        df_prod = df_prod.drop_duplicates(subset=['id_produto'])
        db.bulk_insert_mappings(Produto, df_prod.to_dict(orient="records"))
        db.commit()

        # 2. Consumidores - TRATANDO NULOS
        print("👤 Populando Consumidores...")
        df_cons = pd.read_csv(os.path.join(base_path, "dim_consumidores.csv"))
        df_cons['nome_consumidor'] = df_cons['nome_consumidor'].fillna('Consumidor Desconhecido')
        df_cons = df_cons.drop_duplicates(subset=['id_consumidor'])
        db.bulk_insert_mappings(Consumidor, df_cons.to_dict(orient="records"))
        db.commit()

        # 3. Vendedores
        print("🏪 Populando Vendedores...")
        df_vend = pd.read_csv(os.path.join(base_path, "dim_vendedores.csv"))
        df_vend['nome_vendedor'] = df_vend['nome_vendedor'].fillna('Vendedor Desconhecido')
        df_vend = df_vend.drop_duplicates(subset=['id_vendedor'])
        db.bulk_insert_mappings(Vendedor, df_vend.to_dict(orient="records"))
        db.commit()

        # 4. Fat Pedidos
        print("📝 Populando Pedidos...")
        df_ped = pd.read_csv(os.path.join(base_path, "fat_pedidos.csv"))
        for _, row in df_ped.iterrows():
            if not db.query(Pedido).filter_by(id_pedido=row['id_pedido']).first():
                ped = Pedido(
                    id_pedido=row['id_pedido'],
                    id_consumidor=row['id_consumidor'],
                    status=row['status'],
                    pedido_compra_timestamp=format_date(row['pedido_compra_timestamp']),
                    pedido_entregue_timestamp=format_date(row['pedido_entregue_timestamp'])
                )
                db.add(ped)
        db.commit()

        # 5. Fat Itens Pedidos
        print("🛒 Populando Itens dos Pedidos...")
        df_itens = pd.read_csv(os.path.join(base_path, "fat_itens_pedidos.csv"))
        for _, row in df_itens.iterrows():
            item = ItemPedido(
                id_pedido=row['id_pedido'],
                id_item=row['id_item'],
                id_produto=row['id_produto'],
                id_vendedor=row['id_vendedor'],
                preco_BRL=row['preco_BRL'],
                preco_frete=row['preco_frete']
            )
            db.add(item)

        # 6. Avaliações - DICA EXTRA
        print("⭐ Populando Avaliações...")
        df_aval = pd.read_csv(os.path.join(base_path, "fat_avaliacoes_pedidos.csv"))
        df_aval['titulo_comentario'] = df_aval['titulo_comentario'].fillna('Sem título')
        df_aval['comentario'] = df_aval['comentario'].fillna('Sem comentário')
        df_aval = df_aval.drop_duplicates(subset=['id_avaliacao'])
        for _, row in df_aval.iterrows():
            aval = AvaliacaoPedido(
                id_avaliacao=row['id_avaliacao'],
                id_pedido=row['id_pedido'],
                avaliacao=row['avaliacao'],
                titulo_comentario=row['titulo_comentario'],
                comentario=row['comentario'],
                data_comentario=format_date(row['data_comentario'])
            )
            db.add(aval)

        db.commit()
        print("✅ Banco de dados populado com sucesso!")

    except Exception as e:
        print(f"❌ Erro durante a população: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()