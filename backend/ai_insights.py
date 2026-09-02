import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)


def generate_insights(summary: dict) -> list[str]:
    prompt = f"""Você é um analista de negócios. Com base nestes dados de uma pequena empresa, gere de 2 a 3 insights curtos e acionáveis (máximo 1 frase cada).

Dados:
- Receita do mês: R$ {summary['revenue']:.2f}
- Total de despesas do mês: R$ {summary['expenses']:.2f}
- Clientes cadastrados: {summary['total_clients']}
- Clientes sem nenhuma compra: {summary['clients_without_purchase']}
- Produtos com estoque baixo: {summary['low_stock_products']}

Responda APENAS em JSON, neste formato exato, sem texto antes ou depois:
{{"insights": ["insight 1", "insight 2", "insight 3"]}}"""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            max_tokens=300,
            response_format={"type": "json_object"},
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content
        data = json.loads(raw)
        return data.get("insights", [])
    except Exception as e:
        print(f"Erro ao gerar insights: {e}")
        return ["Não foi possível gerar insights no momento."]