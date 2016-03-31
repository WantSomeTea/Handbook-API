PATH = bin/www

start:
	pm2 start $(PATH)

debug:
	DEBUG=* npm run start
