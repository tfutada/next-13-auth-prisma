a tutorial project to learn next-auth with a DB

pnpm dev

login with Google

localhost:3000/login

open Chrome Dev Tools, copy the session cookie

next-auth.session-token

then paste it to curl

curl -v http://localhost:3000/my-api-auth -H 'Cookie: next-auth.session-token=794a08bd-f96d-4157-9e4d-562b0186f6b8'