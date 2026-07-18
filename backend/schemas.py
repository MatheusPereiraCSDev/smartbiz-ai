from pydantic import BaseModel
from datetime import date


class ClientBase(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True

        

class TransactionBase(BaseModel):
    description: str
    amount: float
    date: date

class DespesaCreate(TransactionBase):
    pass

class PurchaseCreate(TransactionBase):
    client_id: int

class TransactionResponse(TransactionBase):
    id: int
    type: str
    client_id: int | None = None
    client: ClientResponse | None = None

    class Config:
        from_attributes = True