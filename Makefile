.PHONY: deps ligands build-goinfre android-sdk install-cluster expo eval-cluster cluster clean re

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

install-cluster: android-sdk build-goinfre
	cd $(GOINFRE) && npx expo run:android --device --no-bundler

expo: ligands
	npx expo start --go -c

eval: ligands
	adb reverse tcp:8081 tcp:8081
	npx expo start --localhost -c

eval-cluster: android-sdk build-goinfre
	adb reverse tcp:8081 tcp:8081
	cd $(GOINFRE) && npx expo start --localhost -c

clean:
	rm -rf node_modules
	rm -f package-lock.json

re: clean deps