server {

    root /var/www/AntiGamingFront/dist/anti-gaming-front;

    index index.html index.htm index.nginx-debian.html;

    server_name antigaming.studio;

    location / {
        try_files $uri $uri/ /index.html;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/admin.antigaming.studio/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/admin.antigaming.studio/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

server {
    server_name admin.antigaming.studio;

    root /var/www/AdminPanel/dist/admin-panel;

    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/admin.antigaming.studio/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/admin.antigaming.studio/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}

# HTTP server block for api.antigaming.studio (will redirect to HTTPS after setting up Certbot)
server {
    if ($host = api.antigaming.studio) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name api.antigaming.studio;

    location / {
        return 301 https://$host$request_uri;
    }


}

# The HTTPS server block for api.antigaming.studio (will be configured with Certbot)
server {
    listen 443 http2;
    listen [::]:443 http2;
    server_name api.antigaming.studio;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    ssl_certificate /etc/letsencrypt/live/admin.antigaming.studio/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/admin.antigaming.studio/privkey.pem; # managed by Certbot
}
server {
    if ($host = antigaming.studio) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80 default_server;
    listen [::]:80 default_server;

    server_name antigaming.studio;
    return 404; # managed by Certbot


}

server {
    if ($host = admin.antigaming.studio) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name admin.antigaming.studio;
    return 404; # managed by Certbot


}
