.PHONY: install ligands start android go cluster clean re

install:
	npm install

ligands:
	node scripts/generate-ligands.js

start: ligands
	npx expo start

android: ligands
	npx expo start --android

go: ligands
	npx expo start --go -c

cluster: ligands
	adb reverse tcp:8081 tcp:8081
	npx expo start --go --localhost

clean:
	rm -rf node_modules
	rm -f package-lock.json

re: clean install