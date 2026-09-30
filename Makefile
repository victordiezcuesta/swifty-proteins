NAME = swifty-proteins

install:
	npm install

start:
	npx expo start

android:
	npx expo start --android

go:
	npx expo start --go

cluster:
	adb reverse tcp:8081 tcp:8081
	npx expo start --go --localhost

clean:
	rm -rf node_modules
	rm -f package-lock.json

re: clean install