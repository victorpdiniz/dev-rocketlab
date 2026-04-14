# dev-rocketlab
# 🚀 Sistema de Gerenciamento de E-Commerce - Rocket Lab 2026

Módulo de gerenciamento para administradores de loja, permitindo o controle de estoque, visualização de métricas de desempenho de vendas e análise de avaliações de consumidores.

## 🛠️ Stack Tecnológica

- **Frontend:** Vite, React, TypeScript, Tailwind CSS, Axios, Lucide React.
- **Backend:** FastAPI (Python), SQLAlchemy (ORM), Alembic (Migrations).
- **Banco de Dados:** SQLite.

---

## 📋 Requisitos Cumpridos

- [x] **Catálogo de Produtos:** Navegação fluida em lista.
- [x] **Detalhes e Performance:** Visualização de medidas, total de vendas e média de avaliações.
- [x] **Busca Inteligente:** Filtro de produtos por nome via Backend.
- [x] **Gerenciamento Completo (CRUD):** Adicionar, Atualizar e Remover produtos.
- [x] **População Automática:** Script de seed para processamento dos 7 datasets CSV fornecidos.

---

## 🔧 Como Executar a Aplicação

### 1. Configuração do Backend
Navegue até a pasta `backend`:
```bash
cd backend
python -m venv venv
# Ative o ambiente virtual:
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
alembic upgrade head
python -m app.seed   # Importante: Processa os CSVs para o Banco de Dados
python -m app.main   # Inicia a API em http://localhost:8000