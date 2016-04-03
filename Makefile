PATH = bin/www

console:
	npm run start

start:
	pm2 start $(PATH)

debug:
	DEBUG=* npm run start

production:
	PORT=80 pm2 start $(PATH)

production-https:
	PORT=443 pm2 start $(PATH)


# WTF WITH MAKEFILE???
