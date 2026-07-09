# Apache SSL Reverse Proxy for midra.ai

This document describes the reviewed Apache configuration for serving the MINDORA website through `https://midra.ai` and `https://www.midra.ai`.

No certificate or private key files should be committed to Git.

## Certificate Package

The provided Aliyun Apache certificate package contains:

```text
midra.ai_public.crt
midra.ai_chain.crt
midra.ai.key
```

The public certificate covers both names:

```text
DNS:midra.ai
DNS:www.midra.ai
```

Certificate validity:

```text
notBefore=Jul  8 00:00:00 2026 GMT
notAfter=Jan  8 23:59:59 2027 GMT
```

## Target Server Paths

Install certificate files on the EC2 server as:

```bash
sudo mkdir -p /etc/ssl/midra.ai
sudo install -m 0644 midra.ai_public.crt /etc/ssl/midra.ai/midra.ai_public.crt
sudo install -m 0644 midra.ai_chain.crt /etc/ssl/midra.ai/midra.ai_chain.crt
sudo install -m 0600 midra.ai.key /etc/ssl/midra.ai/midra.ai.key
sudo chown -R root:root /etc/ssl/midra.ai
```

## Apache Vhost

Reviewed template:

```text
deploy/apache/midra.ai.conf
```

Behavior:

- `http://midra.ai` redirects to `https://midra.ai`
- `http://www.midra.ai` redirects to `https://www.midra.ai`
- HTTPS traffic reverse proxies to `http://127.0.0.1:3000/`
- `X-Forwarded-Proto` is set to `https`
- `X-Forwarded-Port` is set to `443`
- existing security headers, cache headers, and compression behavior are preserved

## Production Installation Plan

Do not run these steps until review is approved.

1. Back up current Apache vhosts:

```bash
sudo mkdir -p /home/admin/backups
sudo cp /etc/apache2/sites-available/000-default.conf /home/admin/backups/000-default.conf.$(date +%Y%m%d-%H%M%S)
sudo cp /etc/apache2/sites-available/default-ssl.conf /home/admin/backups/default-ssl.conf.$(date +%Y%m%d-%H%M%S)
```

2. Install certificate files to `/etc/ssl/midra.ai/`.

3. Copy the reviewed vhost:

```bash
sudo cp deploy/apache/midra.ai.conf /etc/apache2/sites-available/midra.ai.conf
```

4. Enable required modules and site:

```bash
sudo a2enmod ssl headers proxy proxy_http rewrite deflate
sudo a2dissite 000-default.conf
sudo a2dissite default-ssl.conf
sudo a2ensite midra.ai.conf
```

5. Validate syntax:

```bash
sudo apache2ctl configtest
```

6. Apply with reload, not restart:

```bash
sudo systemctl reload apache2
```

7. Verify:

```bash
curl -I http://midra.ai/
curl -I https://midra.ai/
curl -I https://www.midra.ai/
curl -s -o /dev/null -w "%{http_code}\n" https://midra.ai/
curl -s -o /dev/null -w "%{http_code}\n" https://www.midra.ai/
```

Expected result:

- HTTP returns `301`
- HTTPS returns `200`
- certificate subject/SAN matches `midra.ai` and `www.midra.ai`

## Rollback Plan

If validation fails after reload:

```bash
sudo a2dissite midra.ai.conf
sudo a2ensite 000-default.conf
sudo a2ensite default-ssl.conf
sudo apache2ctl configtest
sudo systemctl reload apache2
```

Then inspect:

```bash
sudo systemctl status apache2 --no-pager
sudo tail -n 100 /var/log/apache2/mindora-error.log
sudo tail -n 100 /var/log/apache2/error.log
```
