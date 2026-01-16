FROM node:14-alpine as build-deps

# ARG BACKEND_URL
WORKDIR /usr/src

FROM nginx:alpine
ARG API_SERVER_NAME
# Install Certbot and the Nginx plugin
RUN apk add --no-cache certbot certbot-nginx

# Create necessary directories
RUN mkdir -p /etc/letsencrypt /var/www/certbot

COPY ./${API_SERVER_NAME}-webapp/ /usr/share/nginx/html

# PRE && PROD
COPY nginx/conf/${API_SERVER_NAME}.conf /etc/nginx/conf.d/default.conf
#API for each envet 
COPY nginx/conf/${API_SERVER_NAME}-api.rewardzai.com.conf /etc/nginx/conf.d/${API_SERVER_NAME}-api.rewardzai.com.conf
#Rag for each env
COPY nginx/conf/${API_SERVER_NAME}-rag.rewardzai.com.conf /etc/nginx/conf.d/${API_SERVER_NAME}-rag.rewardzai.com.conf

# Condition: si API_SERVER_NAME == "eu", copier les fichiers supplémentaires
RUN if [ "$API_SERVER_NAME" = "eu" ]; then \
        echo "Configuration spéciale EU détectée"; \
    fi

# Copie conditionnelle pour EU seulement
COPY nginx/conf/eu-pre-api.rewardzai.com.conf /tmp/eu-pre-api.rewardzai.com.conf
COPY nginx/conf/eu-pre.rewardzai.com.conf /tmp/eu-pre.rewardzai.com.conf
COPY nginx/conf/rewardzai.com.conf /tmp/rewardzai.com.conf

RUN if [ "$API_SERVER_NAME" = "eu" ]; then \
        echo "Copie des configurations EU"; \
        cp /tmp/eu-pre-api.rewardzai.com.conf /etc/nginx/conf.d/eu-pre-api.rewardzai.com.conf && \
        cp /tmp/eu-pre.rewardzai.com.conf /etc/nginx/conf.d/eu-pre.rewardzai.com.conf; \
        cp /tmp/rewardzai.com.conf /etc/nginx/conf.d/rewardzai.com.conf; \
    else \
        echo "API_SERVER_NAME n'est pas 'eu', configurations EU ignorées"; \
    fi && \
    rm -f /tmp/eu-pre-*.conf


EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]

# CMD ["sh", "-c", "nginx && certbot --nginx -d eu.rewardzai.com -d www.eu.rewardzai.com --non-interactive --agree-tos --email toufik@rewardzai.com"]