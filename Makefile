.PHONY: deps ligands build-goinfre android-sdk install expo eval cluster clean re

GOINFRE := /goinfre/$(USER)/swifty-proteins
export ANDROID_HOME := /goinfre/$(USER)/Android/Sdk
export GRADLE_USER_HOME := /goinfre/$(USER)/.gradle
export PATH := $(PATH):$(ANDROID_HOME)/platform-tools:$(ANDROID_HOME)/cmdline-tools/latest/bin

deps:
	npm install

ligands:
	node scripts/generate-ligands.js

build-goinfre: ligands
	mkdir -p $(GOINFRE)
	rsync -a --delete \
		--exclude node_modules \
		--exclude .git \
		--exclude .expo \
		--exclude android \
		--exclude ios \
		./ $(GOINFRE)/
	rm -rf $(GOINFRE)/android
	cd $(GOINFRE) && npm install
# --------------------------------------------------
# SDK
# --------------------------------------------------
android-sdk:
	@if [ ! -d "$(ANDROID_HOME)/platform-tools" ] || [ ! -d "$(ANDROID_HOME)/cmake/3.22.1" ]; then \
		echo ">> Installing Android SDK in goinfre..."; \
		mkdir -p $(ANDROID_HOME)/cmdline-tools; \
		cd /goinfre/$(USER)/Android && \
		curl -sO https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
		unzip -qo commandlinetools-linux-*.zip && \
		rm -rf $(ANDROID_HOME)/cmdline-tools/latest && \
		mv cmdline-tools $(ANDROID_HOME)/cmdline-tools/latest && \
		rm commandlinetools-linux-*.zip; \
		yes | $(ANDROID_HOME)/cmdline-tools/latest/bin/sdkmanager --licenses >/dev/null; \
		$(ANDROID_HOME)/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-36" "build-tools;36.0.0" "ndk;27.1.12297006" "cmake;3.22.1"; \
	fi

# 1. Compila e instala la app nativa en el móvil (USB). Solo hace falta una vez.
install: android-sdk build-goinfre
	cd $(GOINFRE) && npx expo run:android --device --no-bundler

# 2. Expo Go: escaneas el QR con la app de Expo (móvil y PC en la misma red)
expo: ligands
	npx expo start --go -c

# 3. Servidor para la app instalada, móvil por USB (en casa)
eval: ligands
	adb reverse tcp:8081 tcp:8081
	npx expo start --localhost -c

# 4. Igual que eval, pero en el cluster: usa el SDK y la copia de goinfre
cluster: android-sdk build-goinfre
	adb reverse tcp:8081 tcp:8081
	cd $(GOINFRE) && npx expo start --localhost -c

clean:
	rm -rf node_modules
	rm -f package-lock.json

re: clean deps