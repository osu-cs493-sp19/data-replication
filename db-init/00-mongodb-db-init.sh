# This function is from the official MongoDB Docker image's entrypoint script:
# https://github.com/docker-library/mongo/blob/dd8ceb3b3552d11c901a603d0b8b303e2fe4bc2e/3.6/docker-entrypoint.sh#L139-L142
# _js_escape 'some "string" value'
_js_escape() {
	jq --null-input --arg 'str' "$1" '$str'
}

# If the MONGO_USER, MONGO_PASSWORD, and MONGO_INITDB_DATABASE variables are
# defined, then feed JS into mongo to create a user with the specified
# credentials.
if [ "$MONGO_USER" ] && [ "$MONGO_PASSWORD" ] && [ "$MONGO_INITDB_DATABASE" ]; then
	mongo --username "$MONGO_INITDB_ROOT_USERNAME" \
		--password "$MONGO_INITDB_ROOT_PASSWORD" \
		--authenticationDatabase admin \
		--quiet "$MONGO_INITDB_DATABASE" <<-EOJS
			db.createUser({
				user: $(_js_escape "$MONGO_USER"),
				pwd: $(_js_escape "$MONGO_PASSWORD"),
				roles: [ { role: "readWrite", db: $(_js_escape "$MONGO_INITDB_DATABASE") } ]
			})
	EOJS
fi
