dist: dist/eve-api.js dist/eve-api-mock.js
	make $^

# ensure that src/module.js is at the beginning
dist/eve-api.js: src/module.js src/api-service.js src/http-endpoint-factory.js src/url-resolver-service.js
	cat $^ > $@

dist/eve-api-mock.js: src/module-mock.js
	cp $^ $@
