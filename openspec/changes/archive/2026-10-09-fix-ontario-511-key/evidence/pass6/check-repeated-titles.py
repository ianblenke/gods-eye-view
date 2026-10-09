# Check current title references. Diff blocks are records of old and new text.
from pathlib import Path
import re,json
root=Path('/home/ianblenke/docker/gev-work/fix-ontario-511')
change=root/'openspec/changes/fix-ontario-511-key'
live=set()
for file in ['/home/ianblenke/docker/gev-work/fix-ontario-511/openspec/changes/fix-ontario-511-key/evidence/pass5/cctvOntarioKey.test.log','/home/ianblenke/docker/gev-work/fix-ontario-511/openspec/changes/fix-ontario-511-key/evidence/pass5/cctvOntarioRows.test.log']:
 for line in Path(file).read_text().splitlines():
  m=re.match(r'✔ (\[live-sources-\d{3}[^\]]*\].*?) \(',line)
  if m: live.add(m[1])
flags=[];checked=0
for file in change.rglob('*.md'):
 if 'review' in file.relative_to(change).parts or 'evidence' in file.relative_to(change).parts: continue
 text=file.read_text()
 if file.name=='evidence.md': text=text.split('## Pass 5',1)[-1] if '## Pass 5' in text else ''
 text=re.sub(r"```diff\n[\s\S]*?```", "", text)
 for i,line in enumerate(text.splitlines(),1):
  for m in re.finditer(r"(\[live-sources-\d{3}[^\]]*\][^`\"'|\n]*)",line):
   title=m[1].strip().rstrip('.')
   checked+=1
   if title not in live: flags.append({'file':str(file.relative_to(root)),'line':i,'title':title})
print(json.dumps({'live_titles':len(live),'references':checked,'flags':flags},indent=2))
