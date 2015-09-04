server {
    listen 0.0.0.0:80;
    root /usr/share/nginx/html/users;
    index index.html;
    server_name users.hlabs.com;

    location / {
        try_files $uri $uri/ =404;
    }
}
