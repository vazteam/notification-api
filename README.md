notification-api
================

## Endpoints
### /register (POST)
トークンを登録するときに叩く.

```
{
  "id": 1,
  "token": "fc749644c85116c134f539cf0254a1680a48bb70ece5fcd88b9cb79cc74fd0ba"
}
```

#### curl
```
curl -v -XPOST 'http://localhost:3000/register' -H "Content-Type: application/json" -d'{"id": 1, "token": "fc749644c85116c134f539cf0254a1680a48bb70ece5fcd88b9cb79cc74fd0ba"}'
```

### /notify (POST)
通知を送る

```
{
  "ids": [1, 2, 3],
  "message": "これは通知の例",
  "badge": 100
}
```
`badge` は指定しなくてもいい。1つのIDだけに送信する場合でも `"ids": [1]` のように

#### curl
```
curl -v -XPOST 'http://localhost:3000/notify' -H "Content-Type: application/json" -d'{"ids": [1], "message": "Badge->255", "badge": 255}'
```

### /broadcast (POST)
登録されている全ての __トークンに__ 通知を送信する。

```
{
  "message": "これも通知の例"
}
```

#### curl
```
curl -v -XPOST 'http://localhost:3000/broadcast' -H "Content-Type: application/json" -d'{"message": "This is nott PHP", "badge": 333}'
```