# Listener for the Reticulum interface discovery.
# See docs/fork/reticulum-docker.md.
FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# The packages come from PyPI at fixed versions. Interface discovery needs
# lxmf. This repository holds no Reticulum code, because the licence of
# Reticulum limits some uses.
RUN pip install --no-cache-dir rns==1.5.7 lxmf==1.2.0

# The volume mount point belongs to the user of the container, so that a new
# named volume gets the same owner.
RUN mkdir -p /data && chown 10001:10001 /data

COPY listener.py /opt/reticulum/listener.py
COPY config /opt/reticulum/config

USER 10001
EXPOSE 8081
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --retries=3 CMD ["python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8081/interfaces.json', timeout=4).read()"]
ENTRYPOINT ["python", "/opt/reticulum/listener.py"]
