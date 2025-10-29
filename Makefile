.PHONY: dev test lint fmt run clean

dev:
	npm install
	pre-commit install

test:
	npm test

lint:
	npm run lint
	npm run prettier:check

fmt:
	npm run prettier:fix

run:
	npm start

clean:
	rm -rf node_modules dist build coverage
