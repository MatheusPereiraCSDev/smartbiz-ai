def test_register_creates_user(client):
    response = client.post(
        "/auth/register",
        json={"name": "Maria", "email": "maria@example.com", "password": "123456"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["email"] == "maria@example.com"
    assert "id" in data["user"]


def test_register_duplicate_email_fails(client):
    payload = {"name": "Maria", "email": "maria@example.com", "password": "123456"}
    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 400


def test_login_with_correct_credentials(client):
    client.post(
        "/auth/register",
        json={"name": "Maria", "email": "maria@example.com", "password": "123456"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "maria@example.com", "password": "123456"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_with_wrong_password_fails(client):
    client.post(
        "/auth/register",
        json={"name": "Maria", "email": "maria@example.com", "password": "123456"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "maria@example.com", "password": "senha-errada"},
    )
    assert response.status_code == 401


def test_protected_route_requires_token(client):
    response = client.get("/auth/me")
    assert response.status_code in (401, 403)


def test_protected_route_with_valid_token(client, auth_headers):
    response = client.get("/auth/me", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"