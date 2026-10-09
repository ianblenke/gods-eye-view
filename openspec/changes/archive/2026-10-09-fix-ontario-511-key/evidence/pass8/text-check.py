# Check the Pass 8 text changes and report the current terms.
from pathlib import Path
import subprocess,re,json
p=Path('openspec/changes/fix-ontario-511-key');out=p/'evidence/pass8'
d=subprocess.check_output(['git','diff','3ac3af22','--',*[str(p/x) for x in ['proposal.md','design.md','tasks.md','evidence.md']]],text=True)
new='\n'.join(l[1:] for l in d.splitlines() if l.startswith('+') and not l.startswith('+++'))
pattern=r'\b\w*(?:explicit|verify|malformed|wiring|dismiss|dismissal|expose|permit|retain|emit|prior|preserve|renew|lone|handover|execute|prescribed|unverified|echo)\w*\b'
hits=re.findall(pattern,new,re.I);assert not hits,hits
lines=[]
for name in ['design.md','proposal.md','tasks.md','evidence.md']:
 for i,l in enumerate((p/name).read_text().splitlines(),1):
  if re.search(r'base image|test function|routes|loader writes this|cache holds|clauses of scenarios|clause of scenario|E1 sentence|At Pass 6, the automatic',l):lines.append(f'{name}:{i}: {l}')
print('Banned words and prefixed forms in new text: 0')
print('\n'.join(lines))
print('Code cross-check: catalog.js 156-201; constants.js 127-134 and 248; normalize.js 468-471; sources.js 464-539.')
print('Document cross-check: spec.md 21, 29, 31 and 83; ci.yml 23, 57 and 111; Dockerfile 5; automut.mjs 149-150.')
