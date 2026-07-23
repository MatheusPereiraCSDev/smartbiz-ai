def test_create_product(client, auth_headers):
    response = client.post(
        "/products",
        json={"name": "Notebook", "price": 3500.0, "stock": 10},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["stock"] == 10


def test_update_product_stock(client, auth_headers):
    created = client.post(
        "/products",
        json={"name": "Notebook", "price": 3500.0, "stock": 10},
        headers=auth_headers,
    ).json()

    response = client.put(
        f"/products/{created['id']}",
        json={"name": "Notebook", "price": 3500.0, "stock": 3},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["stock"] == 3


def test_delete_product(client, auth_headers):
    created = client.post(
        "/products",
        json={"name": "Notebook", "price": 3500.0, "stock": 10},
        headers=auth_headers,
    ).json()

    response = client.delete(f"/products/{created['id']}", headers=auth_headers)
    assert response.status_code == 200