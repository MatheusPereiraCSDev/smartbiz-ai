def create_test_client(client, auth_headers, name="Cliente Teste", phone="5511999999999"):
    response = client.post(
        "/clients",
        json={"name": name, "email": "cliente@example.com", "phone": phone},
        headers=auth_headers,
    )
    return response.json()


def test_create_expense(client, auth_headers):
    response = client.post(
        "/transactions/expense",
        json={"description": "Aluguel", "amount": 1500.0, "date": "2026-07-01"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "despesa"
    assert data["client_id"] is None


def test_expense_requires_auth(client):
    response = client.post(
        "/transactions/expense",
        json={"description": "Aluguel", "amount": 1500.0, "date": "2026-07-01"},
    )
    assert response.status_code in (401, 403)


def test_create_purchase_linked_to_client(client, auth_headers):
    test_client = create_test_client(client, auth_headers)

    response = client.post(
        "/transactions/purchase",
        json={
            "description": "Compra rápida",
            "amount": 250.0,
            "date": "2026-07-10",
            "client_id": test_client["id"],
        },
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["type"] == "receita"
    assert data["client_id"] == test_client["id"]
    assert data["client"]["name"] == test_client["name"]


def test_purchase_with_nonexistent_client_fails(client, auth_headers):
    response = client.post(
        "/transactions/purchase",
        json={
            "description": "Compra rápida",
            "amount": 250.0,
            "date": "2026-07-10",
            "client_id": 9999,
        },
        headers=auth_headers,
    )
    assert response.status_code == 404


def test_list_transactions_includes_expenses_and_purchases(client, auth_headers):
    test_client = create_test_client(client, auth_headers)

    client.post(
        "/transactions/expense",
        json={"description": "Aluguel", "amount": 1500.0, "date": "2026-07-01"},
        headers=auth_headers,
    )
    client.post(
        "/transactions/purchase",
        json={
            "description": "Compra rápida",
            "amount": 250.0,
            "date": "2026-07-10",
            "client_id": test_client["id"],
        },
        headers=auth_headers,
    )

    response = client.get("/transactions", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_update_expense(client, auth_headers):
    created = client.post(
        "/transactions/expense",
        json={"description": "Aluguel", "amount": 1500.0, "date": "2026-07-01"},
        headers=auth_headers,
    ).json()

    response = client.put(
        f"/transactions/{created['id']}",
        json={"description": "Aluguel corrigido", "amount": 1600.0, "date": "2026-07-01"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["description"] == "Aluguel corrigido"
    assert response.json()["amount"] == 1600.0


def test_cannot_edit_purchase_as_expense(client, auth_headers):
    test_client = create_test_client(client, auth_headers)

    purchase = client.post(
        "/transactions/purchase",
        json={
            "description": "Compra rápida",
            "amount": 250.0,
            "date": "2026-07-10",
            "client_id": test_client["id"],
        },
        headers=auth_headers,
    ).json()

    response = client.put(
        f"/transactions/{purchase['id']}",
        json={"description": "Tentando editar", "amount": 999.0, "date": "2026-07-10"},
        headers=auth_headers,
    )
    assert response.status_code == 400


def test_delete_transaction(client, auth_headers):
    created = client.post(
        "/transactions/expense",
        json={"description": "Aluguel", "amount": 1500.0, "date": "2026-07-01"},
        headers=auth_headers,
    ).json()

    response = client.delete(f"/transactions/{created['id']}", headers=auth_headers)
    assert response.status_code == 200

    list_response = client.get("/transactions", headers=auth_headers)
    assert len(list_response.json()) == 0


def test_delete_nonexistent_transaction_returns_404(client, auth_headers):
    response = client.delete("/transactions/9999", headers=auth_headers)
    assert response.status_code == 404