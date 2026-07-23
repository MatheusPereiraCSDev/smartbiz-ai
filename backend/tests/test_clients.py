def test_create_client(client, auth_headers):
    response = client.post(
        "/clients",
        json={"name": "João Silva", "email": "joao@example.com", "phone": "5511999999999"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "João Silva"


def test_list_clients_requires_auth(client):
    response = client.get("/clients")
    assert response.status_code in (401, 403)


def test_list_clients_returns_created_client(client, auth_headers):
    client.post(
        "/clients",
        json={"name": "João Silva", "email": "joao@example.com", "phone": "5511999999999"},
        headers=auth_headers,
    )
    response = client.get("/clients", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_update_client(client, auth_headers):
    created = client.post(
        "/clients",
        json={"name": "João Silva", "email": "joao@example.com", "phone": "5511999999999"},
        headers=auth_headers,
    ).json()

    response = client.put(
        f"/clients/{created['id']}",
        json={"name": "João Souza", "email": "joao@example.com", "phone": "5511999999999"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["name"] == "João Souza"


def test_delete_client(client, auth_headers):
    created = client.post(
        "/clients",
        json={"name": "João Silva", "email": "joao@example.com", "phone": "5511999999999"},
        headers=auth_headers,
    ).json()

    response = client.delete(f"/clients/{created['id']}", headers=auth_headers)
    assert response.status_code == 200

    list_response = client.get("/clients", headers=auth_headers)
    assert len(list_response.json()) == 0


def test_delete_nonexistent_client_returns_404(client, auth_headers):
    response = client.delete("/clients/9999", headers=auth_headers)
    assert response.status_code == 404