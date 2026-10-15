# Deploying the frontend to a VPS (podman + nginx + `next start`)

This folder contains everything needed to run the built frontend on a VPS next to
the Django backend: a container image, an Nginx reverse proxy, and the CI job
that builds and deploys it.

> The Netlify setup stays in place for now. Nothing here is active until you
> rename the (deliberately inert) workflow file — see **Activate the pipeline**.

## Architecture

```
Internet ──▶ Nginx (443, TLS)  ──proxy──▶  podman container  ──▶  `next start`
              host, certbot                 127.0.0.1:3000          Node 22
                                             (pulsehavana-frontend)
```

- The image is built **in CI** and pushed to the GitHub Container Registry (GHCR).
- The VPS only **pulls and restarts** the container — no build toolchain needed.
- The container listens on `127.0.0.1:3000` only; Nginx terminates TLS and proxies.
- The app runs as a non-root user (`nextjs`) inside `node:22-alpine`.

## Files

| File | Purpose |
| --- | --- |
| `Containerfile` | Multi-stage production image (`next start`). |
| `.dockerignore` | Keeps the build context small. |
| `.github/workflows/deploy-vps.yml.disabled` | CI: build → push to GHCR → SSH deploy. **Inert** until renamed. |
| `deploy/nginx.conf` | Reverse-proxy + TLS server block. |
| `deploy/pulsehavana-frontend.container` | Podman **Quadlet** unit (systemd-managed container). |
| `deploy/rollback.sh` | Roll the container back/forward to a given image tag. |

## GitHub secrets & variables

**Secrets** (Settings → Secrets and variables → Actions → *Secrets*):

| Secret | Value |
| --- | --- |
| `VPS_HOST` | VPS IP or hostname. |
| `VPS_USER` | SSH user (e.g. `deploy`). |
| `VPS_SSH_KEY` | Private key (ed25519) whose public key is in `~/.ssh/authorized_keys` on the VPS. |
| `VPS_SSH_KNOWN_HOSTS` | Output of `ssh-keyscan -H <VPS_HOST>` (pins the host key). |

**Variables** (*Variables* tab):

| Variable | Value |
| --- | --- |
| `VPS_SSH_PORT` | SSH port (optional, defaults to `22`). |
| `PUBLIC_URL` | Public site URL, shown in the deployment (optional). |

## One-time VPS setup

1. **Install the runtime** (example for Debian/Ubuntu):

   ```bash
   sudo apt update && sudo apt install -y podman nginx certbot python3-certbot-nginx
   ```

2. **Enable rootless podman for the deploy user** (so its services survive logout):

   ```bash
   sudo loginctl enable-linger deploy
   ```

3. **Let the VPS pull the image.** Either make the GHCR package **public**
   (Repository → Packages → package settings → Change visibility), or log in once:

   ```bash
   echo "<A_GITHUB_PAT_WITH_read:packages>" | podman login ghcr.io -u <USER> --password-stdin
   ```

4. **Install the container as a Quadlet unit:**

   ```bash
   mkdir -p ~/.config/containers/systemd
   cp deploy/pulsehavana-frontend.container ~/.config/containers/systemd/
   systemctl --user daemon-reload
   systemctl --user start pulsehavana-frontend.service   # first start pulls :latest
   ```

   The CI deploy pins each release to its commit tag by writing a drop-in
   (`pulsehavana-frontend.container.d/10-image.conf`) and restarting the unit.

5. **Install the Nginx proxy:**

   ```bash
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/pulsehavana-frontend
   sudo sed -i 's/DOMAIN/your.domain.tld/g' /etc/nginx/sites-available/pulsehavana-frontend
   sudo ln -s /etc/nginx/sites-available/pulsehavana-frontend /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   sudo certbot --nginx -d your.domain.tld
   ```

6. **Firewall:** allow `80`/`443` (public) and keep `3000` bound to loopback only.

## Activate the pipeline

The workflow is inert because GitHub only runs files ending in `.yml`/`.yaml`:

```bash
git mv .github/workflows/deploy-vps.yml.disabled .github/workflows/deploy-vps.yml
```

Then push to `main` (or trigger it from the **Actions** tab). Deploys are keyed by
commit SHA, so a rollback is one command on the VPS:

```bash
./deploy/rollback.sh <previous-sha>
```

## Avoiding the classic CI failure (`systemctl --user` over SSH)

The failure that bites most teams when a workflow manages a **rootless**
podman/Quadlet unit over SSH is:

```
Failed to connect to bus: No such file or directory
Failed to get D-Bus connection: ...
```

A non-interactive SSH command has **no user session bus**, so `systemctl --user`
cannot reach the user's systemd manager. The workflow and `rollback.sh` already
work around the known pitfalls:

| Symptom | Cause | Fix (already applied) |
| --- | --- | --- |
| `Failed to connect to bus` / `Failed to get D-Bus connection` | `XDG_RUNTIME_DIR` is unset in non-interactive SSH | `export XDG_RUNTIME_DIR="/run/user/$(id -u)"` before any `systemctl --user` |
| `systemctl --user` finds no unit | The user manager isn't running | one-time `sudo loginctl enable-linger <user>` |
| `Unit ... not found` after adding the `.container` file | Quadlet units are *generated*, not enabled | `systemctl --user daemon-reload` after any change — never `systemctl enable` a Quadlet unit |
| Deploy edits/echoes the wrong host, or errors on the CI runner | An unquoted heredoc expanded `$(...)` locally | Use a quoted heredoc (`<<'EOF'`) so expansion happens on the VPS |
| `Host key verification failed` / a stuck prompt | Unknown host key | Pin it through the `VPS_SSH_KNOWN_HOSTS` secret |
| `unauthorized: authentication required` on `podman pull` | Private GHCR package | make the package public, or `podman login ghcr.io` once on the VPS |
| `sudo: a terminal is required to read the password` | Non-interactive SSH has no TTY | use rootless podman, or configure passwordless `sudo` |
| Output/timeout weirdness in logs | `systemctl` opened a pager | always pass `--no-pager` |

**Debug on the server:**

```bash
systemctl --user status pulsehavana-frontend.service --no-pager
podman logs --tail 50 pulsehavana-frontend
./deploy/rollback.sh latest --no-health-check   # redeploy the current latest
```

## Notes for the Django integration

- **`NEXT_PUBLIC_*` variables are inlined at build time**, not at runtime. When the
  app starts talking to the Django API, pass the public API URL as a **build arg**
  in CI (and in the `Containerfile` `build` stage), not as a runtime `-e`.
- Runtime-only settings (secrets, server-side API base URL) can be passed with
  `podman run -e ...`.
- Once Netlify is retired, consider switching to Next's `output: "standalone"`
  (smaller image; run `node server.js` instead of `next start`).
