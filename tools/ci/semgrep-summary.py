"""Print finding locations only; never publish source snippets or matched values."""
import json
import sys
from pathlib import Path

report = json.loads(Path(sys.argv[1]).read_text())
results = report.get("results", [])
errors = report.get("errors", [])
print(f"Semgrep: {len(results)} findings; {len(errors)} scan errors.")
for finding in results:
    print(json.dumps({
        "rule": finding["check_id"],
        "path": finding["path"],
        "line": finding["start"]["line"],
    }))
for error in errors:
    print(json.dumps({"error_type": error.get("type"), "code": error.get("code")}))
