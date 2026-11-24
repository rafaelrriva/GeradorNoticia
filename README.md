# Gerador de artes (TribeMD · Oncologia Brasil · Hemomeeting)

Site estático (GitHub Pages) com três abas:

- **Rodapé**: o Gerador de rodapé completo (Título acima / Título ao lado, PNG, 1920 × 1080 e PSD).
- **Gerar notícia**: todas as artes ao mesmo tempo (Feed, Stories, LinkedIn, Banner principal, Site, Site mobile, Site OBR e Hemo e formatos personalizados), com PSD único de pranchetas.
- **Banco de dados**: cores, sombra das fotos, doutores, logos e rodapés salvos.

## Banco de dados = este repositório

```
index.html              página
style.css               visual
script.js               funcionamento
logos/logos.json        lista de logos e templates
logos/grupo/            PNGs dos logos do grupo
logos/farmaceuticas/    PNGs dos logos das farmacêuticas
dados/banco.json        cores, sombra das fotos, doutores e rodapés salvos
dados/medicos/          fotos dos doutores (JPG)
```

Todo mundo que abre o site **lê** esses arquivos. Quem conecta a chave do GitHub (**Conectar GitHub**, no topo) **grava**: cada alteração vira um commit e o GitHub Pages republica em 1–2 minutos. A chave fica salva só no navegador de quem conectou.

## Atualizar o repositório do Gerador de rodapé

1. No repositório atual do Gerador de rodapé, envie **todos** os arquivos deste pacote para a raiz (substituindo `index.html` e `script.js`, e incluindo `style.css` e a pasta `dados/`). A pasta `logos/` deste pacote é a mesma que você enviou; se alguém publicou logos depois, mantenha a do repositório.
2. Pode apagar o `style.css` antigo, se o nome for diferente; o site usa `style.css`.
3. Em 1–2 minutos o site novo está no mesmo endereço (`https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`).

A chave que já estava salva no navegador continua valendo: o site novo usa o mesmo lugar para guardá-la.

## Chave do GitHub

Fine-grained token, em **Settings → Developer settings → Fine-grained tokens**:

- **Repository access**: Only select repositories → este repositório.
- **Repository permissions → Contents**: **Read and write**.

Ao conectar, o site faz um diagnóstico (chave válida → enxerga o repositório → branch existe → pode gravar) e diz exatamente o que corrigir se algo falhar.

## O que o administrador altera pelo site

| Onde | O quê | Arquivos do commit |
|---|---|---|
| Rodapé / Banco | Publicar, trocar e remover logos | PNG + `logos/logos.json` |
| Banco › Cores | Cores das marcas, branca, preta e sombra das fotos (editar → **Publicar**) | `dados/banco.json` |
| Banco › Doutores / botão ⤒ na notícia | Incluir, editar e excluir doutores | JPG em `dados/medicos/` + `dados/banco.json` |
| Rodapé › Salvar no banco | Salvar e excluir rodapés prontos | `dados/banco.json` |

Se duas pessoas publicarem ao mesmo tempo, o site lê a versão mais nova e tenta de novo sozinho.

## Editar à mão

- Logos e templates: igual ao Gerador de rodapé (veja `logos/logos.json`).
- `dados/banco.json`: JSON comum. Cores em `"cores"`, sombra em `"aparencia" › "sombra_fotos"` (0 a 1), doutores em `"medicos"`, rodapés em `"rodapes"`.

## Testar no computador

O site precisa ser aberto por um endereço `http` (não com duplo clique). Na pasta do projeto:

```
python -m http.server
```

e abra `http://localhost:8000`.
