import httpx

N8N_WEBHOOK_URL = "http://localhost:5678/webhook/enviar-mensagem"

def send_purchase_notification(phone: str, client_name: str, description: str, amount: float):
    if not phone:
        return

    try:
        httpx.post(
            N8N_WEBHOOK_URL,
            json={
                "number": phone,
                "text": f"Olá {client_name}! Sua compra '{description}' no valor de R$ {amount:.2f} foi registrada com sucesso."
            },
            timeout=5,
        )
    except httpx.RequestError:
        pass