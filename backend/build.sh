#!/usr/bin/env bash
set -o errexit
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
DJANGO_SUPERUSER_PASSWORD=Admin12345! python manage.py createsuperuser --noinput --username admin --email admin@compushop.tz || true
python seed_data.py || true
