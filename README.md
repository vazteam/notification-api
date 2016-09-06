notification-api
================

## REST API
### POST `/register`
トークンを登録するときに叩く.

Sample Request:
```
{
  "id": 1,
  "token": "fc749644c85116c134f539cf0254a1680a48bb70ece5fcd88b9cb79cc74fd0ba",
}
```

#### curl
```
curl -v -XPOST 'http://localhost:3000/register' -H "Content-Type: application/json" -d'{"id": 1, "token": "fc749644c85116c134f539cf0254a1680a48bb70ece5fcd88b9cb79cc74fd0ba"}'
```

### POST `/notify`
通知を送る

Sample Request:
```
{
  "ids": [1, 2, 3],
  "message": "これは通知の例",
  "badge": 100,
  "payload": {
    "some-key": "some-value"
  }
}
```
`badge` は指定しなくてもいい。1つのIDだけに送信する場合でも `"ids": [1]` のように

#### curl
```
curl -v -XPOST 'http://localhost:3000/notify' -H "Content-Type: application/json" -d'{"ids": [1], "message": "Badge->255", "badge": 255}'
```

### POST `/broadcast`
登録されている全ての __トークンに__ 通知を送信する。

Sample Request:
```
{
  "message": "これも通知の例"
}
```

#### curl
```
curl -v -XPOST 'http://localhost:3000/broadcast' -H "Content-Type: application/json" -d'{"message": "This is nott PHP", "badge": 333}'
```

### POST `/clearBadgeCount`
指定した id の badge を 0 に戻す。

Sample Request:
```
{
  "id": 1
}
```
