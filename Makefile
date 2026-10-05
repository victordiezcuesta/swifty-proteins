.PHONY: install ligands start android eval go cluster clean re build-goinfre

# Carpeta donde se hará la compilación
GOINFRE := /goinfre/$(USER)/swifty-proteins

install:
	npm install

ligands:
	node scripts/generate-ligands.js

start: ligands
	npx expo start

# --------------------------------------------------
# GOINFRE
# --------------------------------------------------
build-goinfre: ligands
	mkdir -p $(GOINFRE)
	rsync -a --delete \
		--exclude node_modules \
		--exclude .git \
		--exclude .expo \
		./ $(GOINFRE)/

	cd $(GOINFRE) && npm install

# --------------------------------------------------
# ANDROID
# --------------------------------------------------
android: build-goinfre
	cd $(GOINFRE) && npx expo run:android --device

eval: build-goinfre
	cd $(GOINFRE) && npx expo run:android --device --variant release

# --------------------------------------------------
# EXPO GO
# --------------------------------------------------
go: ligands
	npx expo start --go -c

cluster: ligands
	adb reverse tcp:8081 tcp:8081
	npx expo start --go --localhost

clean:
	rm -rf node_modules
	rm -f package-lock.json

re: clean install