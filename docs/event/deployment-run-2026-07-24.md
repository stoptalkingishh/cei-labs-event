# Deployment Run 2026-07-24 (192.168.1.173)

**Date:** 2026-07-24  
**Target:** 192.168.1.173 (aronnax-lab)  
**Repos deployed:**
- `cei-labs-engine` @ commit `0f47f4a`
- `CEI-Labs-Wargames` @ commit `f4d9291`

## What Worked

### Stack Deployment (Run 1)
- Built `ctfd` and `orchestrator` images locally using `docker/` config with `IMAGE_TAG=offline` and `GITHUB_ORG=stoptalkingishh`.
  - ctfd build: 17.0s
  - orchestrator build: 5.9s
- Ran `sudo ./scripts/stack-up.sh` in `/opt/cei-labs/cei-labs-engine`.
- All 5 services converged to 1/1 replicas in ~30s with zero restarts:
  - ctfd
  - ctfd-db
  - ctfd-redis
  - orchestrator
  - traefik
- Health check: `curl -sk https://127.0.0.1/` returned HTTP 302 (expected redirect to setup wizard for fresh database).
- Stack deploy matched documentation exactly; no workarounds needed.

### CTFd Bootstrap & Challenge Load (Run 2)
- Non-interactively bootstrapped CTFd admin account following `docs/local-testing-deployment.md` Path B:
  - Scraped CSRF nonce from `/setup` endpoint
  - POSTed wizard configuration fields
  - Logged in and generated API token via `/api/v1/tokens`
  - Procedure worked exactly as documented.
- Ran `CEI-Labs-Wargames/deploy.sh` with required environment variables (CTFD_URL, CTFD_TOKEN, CTFD_SYNC_SECRET) and `CTFD_INSECURE=true` for self-signed cert.
- Verified challenge load: `GET /api/v1/challenges` returned exactly **59 challenges**:
  - 35 Bandit
  - 16 Natas
  - 8 Krypton
  - Matches expected count exactly.
- All challenges loaded successfully.

**Note on credentials:** Fresh CTFd admin credentials and API token were generated during this test run. These should be rotated/not reused for any real event deployment.

## Needs a Follow-up PR

### Documentation Gap: Missing Hint-Wallet Environment Variables

**File:** `CEI-Labs-Wargames/docs/local-testing-deployment.md`  
**Section:** Path B (Non-interactive CTFd Bootstrap)

**Issue:** The documentation describes `CTFD_SYNC_SECRET` as the environment variable for hint-wallet synchronization, but `deploy.sh` actually requires **two separate environment variables**:
- `HINT_WALLET_SYNC_SECRET`
- `HINT_WALLET_REVISION`

The script correctly fails hard (not silently) if hint-wallet content exists but these variables are unset — this fail-closed behavior is correct by design — but the documentation does not mention these two required variables. Anyone following the Path B example literally would hit an unexplained hard failure during the hint-wallet sync step.

**Recommended fix:**
1. Add `HINT_WALLET_SYNC_SECRET` and `HINT_WALLET_REVISION` to the Path B environment variables table in `docs/local-testing-deployment.md`.
2. Optionally: improve the error message in `deploy.sh` to explicitly name both required variables (one-line hint to stderr when either is missing).

**This is not blocking deployment success** — the issue only manifests if hint-wallet challenges are being synced. Stack deploy and challenge load without hint-wallet content work perfectly.

---

**Next steps:** A separate PR should be opened to update the documentation and/or error messaging as described above. This note captures the finding for tracking purposes.
