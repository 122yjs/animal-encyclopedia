# Errors

Command failures and integration errors.

---

## [ERR-20260712-001] exec_command worktree bootstrap

**Logged**: 2026-07-12T16:57:00+09:00
**Priority**: low
**Status**: resolved
**Area**: infra

### Summary
An exec process cannot start with a workdir that the same command intends to create.

### Error
```
CreateProcess: No such file or directory (os error 2)
```

### Context
- Attempted to create a Git worktree and build it in one command.
- The command's workdir pointed at the not-yet-created worktree.

### Suggested Fix
Run worktree creation from an existing repository path, then run build commands with the new worktree as workdir.

### Metadata
- Reproducible: yes
- Related Files: none

### Resolution
- **Resolved**: 2026-07-12T16:57:00+09:00
- **Notes**: Retried from the existing project root.

---
