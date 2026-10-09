# Run one host test file per process for Pass 6.
from pathlib import Path
import subprocess,json,re,difflib
p=Path('openspec/changes/fix-ontario-511-key');out=p/'evidence/pass6'
def run(name,args):
 r=subprocess.run(args,capture_output=True,text=True); t=r.stdout+r.stderr;(out/name).write_text('Command: '+' '.join(args)+'\n'+t);return r,t
host=json.loads((p/'evidence/pass5/console-probe.json').read_text());image=json.loads((out/'console-probe-image.json').read_text())
assert host['results']==image['results'];assert len(host['results'])==13
(out/'console-compare.log').write_text('Command: python /tmp/pass6-check.py (console comparison)\n13 routes equal: Node '+host['node']+' = Node '+image['node']+'\ndirxml: direct stdout on both versions\n')
print((out/'console-compare.log').read_text())
diffs=[]
for name in ['cctvOntarioKey.test.mjs','cctvOntarioRows.test.mjs']:
 r,t=run(name+'.diff',['diff','-u','/tmp/ont-pass5-tree/src/data/'+name,'src/data/'+name]);diffs.append(t);assert r.returncode in [0,1]
print(''.join(diffs))
rows=[]
for f in sorted(Path('src/data').glob('cctv*.test.mjs'))+[Path('src/tooling/mediaProviders.test.mjs')]+sorted(Path('src/layers/cctv').glob('*.test.mjs')):
 r,t=run(f.stem+'.log',['taskset','-c','8-11','nice','-n','19','node','--test','--test-isolation=none',str(f)])
 v={'file':str(f),'exit':r.returncode,**{k:int(v) for k,v in re.findall(r'ℹ (tests|pass|fail) (\d+)',t)}};rows.append(v);print(json.dumps(v),flush=True)
(out/'checks.json').write_text(json.dumps(rows,indent=2));assert len(rows)==25;assert sum(x['tests'] for x in rows)==336;assert all(x['exit']==0 and x['fail']==0 for x in rows)
for name,args in [('format.log',['taskset','-c','8-11','nice','-n','19','node','--import','/home/ianblenke/docker/gev-tools/director-4c/format-host.mjs','scripts/format.mjs','--check']),('boundaries.log',['taskset','-c','8-11','nice','-n','19','node','scripts/check-package-boundaries.mjs']),('repeated-titles.json',['python','/home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/check-repeated-titles.py']),('verbs.json',['python','/home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/check-verbs.py']),('openspec-show.json',['openspec','show','fix-ontario-511-key','--json']),('openspec-validate.log',['openspec','validate','fix-ontario-511-key'])]:
 r,t=run(name,args);print(name,r.returncode,t[:200],flush=True);assert r.returncode==0
old=subprocess.check_output(['git','show','d0b0c776:'+str(p/'proposal.md')],text=True);new=(p/'proposal.md').read_text();a=[l for l in old.splitlines() if l.startswith('#')];b=[l for l in new.splitlines() if l.startswith('#')];assert a==b
(out/'headings.diff').write_text('Command: compare proposal section titles against d0b0c776\nNo section title changes.\n')
r,t=run('code.diff',['git','diff','d0b0c776','--','src','server','scripts']);assert not t
r,t=run('readme.diff',['git','diff','e2437f94','--','README.md']);print(t)
