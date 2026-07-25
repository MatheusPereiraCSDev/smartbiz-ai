from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import engine, Base, SessionLocal
import models
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from security import hash_password, verify_password, create_access_token, decode_access_token
from notifications import send_purchase_notification
import schemas
from ai_insights import generate_insights
from datetime import date


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

security_scheme = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
    except ValueError:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    if user_id is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")

    return user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://gest-o-empresarial-ten.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@app.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="E-mail ou senha inválidos")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        },
    }

@app.get("/")
def read_root():
    return {"status": "SmartBiz AI API está no ar"}


@app.post("/auth/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")

    new_user = models.User(
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Cadastro realizado com sucesso",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
        },
    }

@app.get("/auth/me")
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
    }


@app.get("/clients", response_model=list[schemas.ClientResponse])
def list_clients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Client).all()


@app.post("/clients", response_model=schemas.ClientResponse)
def create_client(
    data: schemas.ClientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_client = models.Client(**data.model_dump(), owner_id=current_user.id)
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client


@app.put("/clients/{client_id}", response_model=schemas.ClientResponse)
def update_client(
    client_id: int,
    data: schemas.ClientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    for field, value in data.model_dump().items():
        setattr(client, field, value)

    db.commit()
    db.refresh(client)
    return client


@app.delete("/clients/{client_id}")
def delete_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    client = db.query(models.Client).filter(models.Client.id == client_id).first()

    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    db.delete(client)
    db.commit()
    return {"message": "Cliente removido com sucesso"}

@app.get("/transactions", response_model=list[schemas.TransactionResponse])
def list_transactions(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Transaction).order_by(models.Transaction.date.desc()).all()


@app.post("/transactions/expense", response_model=schemas.TransactionResponse)
def create_expense(
    data: schemas.DespesaCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_transaction = models.Transaction(**data.model_dump(), type="despesa", owner_id=current_user.id)
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    return new_transaction


@app.post("/transactions/purchase", response_model=schemas.TransactionResponse)
def create_purchase(
    data: schemas.PurchaseCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    client = db.query(models.Client).filter(models.Client.id == data.client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    new_transaction = models.Transaction(**data.model_dump(), type="receita", owner_id=current_user.id)
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    send_purchase_notification(
    phone=client.phone,
    client_name=client.name,
    description=new_transaction.description,
    amount=new_transaction.amount,
)
    return new_transaction


@app.delete("/transactions/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    db.delete(transaction)
    db.commit()
    return {"message": "Transação removida com sucesso"}

@app.get("/products", response_model=list[schemas.ProductResponse])
def list_products(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Product).all()


@app.post("/products", response_model=schemas.ProductResponse)
def create_product(
    data: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    new_product = models.Product(**data.model_dump(), owner_id=current_user.id)
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


@app.put("/products/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int,
    data: schemas.ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    for field, value in data.model_dump().items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(product)
    db.commit()
    return {"message": "Produto removido com sucesso"}

@app.put("/transactions/{transaction_id}", response_model=schemas.TransactionResponse)
def update_transaction(
    transaction_id: int,
    data: schemas.DespesaCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    transaction = db.query(models.Transaction).filter(models.Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transação não encontrada")

    if transaction.type != "despesa":
        raise HTTPException(status_code=400, detail="Apenas despesas podem ser editadas")

    for field, value in data.model_dump().items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)
    return transaction

@app.get("/dashboard/insights")
def get_dashboard_insights(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    today = date.today()
    transactions = db.query(models.Transaction).all()
    clients = db.query(models.Client).all()
    products = db.query(models.Product).all()

    month_revenue = sum(
        t.amount for t in transactions
        if t.type == "receita" and t.date.month == today.month and t.date.year == today.year
    )
    month_expenses = sum(
        t.amount for t in transactions
        if t.type == "despesa" and t.date.month == today.month and t.date.year == today.year
    )
    clients_without_purchase = sum(
        1 for c in clients if not any(t.client_id == c.id for t in transactions)
    )
    low_stock = sum(1 for p in products if p.stock <= 5)

    summary = {
        "revenue": month_revenue,
        "expenses": month_expenses,
        "total_clients": len(clients),
        "clients_without_purchase": clients_without_purchase,
        "low_stock_products": low_stock,
    }

    insights = generate_insights(summary)
    return {"insights": insights}