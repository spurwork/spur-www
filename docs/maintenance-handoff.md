# Maintenance handoff

Source review: 2026-11-04. This is a repository adapter and an open readiness record, not service acceptance or release authorization.

## Scope and source

Static public education website with checked-in generated HTML and Node content generators.

Default branch reviewed: `main`. Preserve existing repository instructions, application tests and CI. Use the maintainers' currently approved contribution workflow and verify its command/plugin dependencies before execution. This file is public contributor guidance; privileged operating evidence and private workflow installation details belong in the approved private operating record.

## Checks

Read package manifests and the current CI before execution. Install dependencies only in an isolated environment after reviewing lifecycle scripts and protected dependency access. These are commands found in the source, not passing results from this review:

- `npm test`
- `npm run build`

Publishing mechanism was verified through repository Pages metadata on 2026-11-04; live content, DNS control, content approval and rollback execution were not tested.

## Publication and recovery

GitHub Pages API confirms legacy publishing from main at repository root for spureducation.com. A main merge can publish generated or handwritten content even without a workflow file. No repository webhook was returned. Root Markdown under docs/ may also become public Pages content; review this guidance and every new file as public content before merging. This source review did not verify a Pages exclusion. Check other installed integrations before any remote branch publication.

Review source and generated outputs together; npm test regenerates the FAQ. Confirm domain/content ownership and the exact Pages artifact. Before release record the prior main commit and an approved forward recovery procedure; verify the restored site in a logged-out browser. This site owns no application database migration.

## Receiving checklist

- Confirm the existing work item, approved maintenance scope and repository mapping; new products and business-policy changes need their own authorization. Do not infer approval from an assignment or elapsed time.
- Verify the existing project/team and role identities before adding a machine-consumed owner manifest. No private project ID, operating budget or privileged access has been copied here.
- Confirm the builder's actual approved command/plugin versions and every referenced dependency; exercise one authorized ticket in a feature worktree with independent review. No new dispatcher or workflow engine is introduced here.
- Record where each role obtains approved source, non-production test access and logs; verify the intended role's own access without copying credentials or customer data into this repository.
- Record acceptance criteria, synthetic fixture/role boundaries, exact revision and test evidence. A different person verifies the relevant behavior.
- Before release, identify target, branch/PR/provider triggers, migrations or dependency order, recovery artifact and release authority. Recheck the exact head and obtain the required approval before a production-triggering action.
- Confirm alert source, accountable primary and backup pickup, missing-event handling, applicable restore/recovery proof, and independent deployed-outcome verification. Track these in the existing operating record; source review alone closes none of them.

Keep new publication and service acceptance pending until the unresolved items above have evidence.
