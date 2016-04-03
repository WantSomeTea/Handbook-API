# Handbook

[Link: factory-handbook.tk](factory-handbook.tk)

[How to write Documentation guide](http://apidocjs.com)

### Helpers:

`npm run console` Запуск с оутпутом в консоль

`npm run debug` Запуск дебага с оутпутом в консоль ВСЕХ дебажных строк

`npm run start` Запуск с pm2

`npm run production` Запуск в продакшен с pm2 для http(port=80)

`npm run production-https` Запуск в продакшен с pm2 для https(port=443)

#### Questions

- Нужны ли тесты?
- Для настройки pm2 **как надо** открываем [документацию](http://pm2.keymetrics.io/docs/usage/application-declaration/)

#### Logs

```
$HOME/.pm2 will contain all PM2 related files
$HOME/.pm2/logs will contain all applications logs
$HOME/.pm2/pids will contain all applications pids
$HOME/.pm2/pm2.log PM2 logs
$HOME/.pm2/pm2.pid PM2 pid
$HOME/.pm2/conf.js PM2 Configuration
```

## LICENSE
ПО предназначено для использования в учебных целях.

(c) 2016 _Trofimov Pavel, Agapov Alexey, Kuchin Sergey_
