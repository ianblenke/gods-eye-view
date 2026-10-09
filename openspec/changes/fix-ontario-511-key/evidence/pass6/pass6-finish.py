# Run the Pass 6 text and structure checks.
from pathlib import Path
import subprocess,json,re
p=Path("openspec/changes/fix-ontario-511-key");out=p/"evidence/pass6"
def run(name,args):
 r=subprocess.run(args,capture_output=True,text=True); t=r.stdout+r.stderr;(out/name).write_text('Command: '+' '.join(args)+'\n'+t);return r,t
for name,args in [('format.log',['taskset','-c','8-11','nice','-n','19','node','--import','/home/ianblenke/docker/gev-tools/director-4c/format-host.mjs','scripts/format.mjs','--check']),('boundaries.log',['taskset','-c','8-11','nice','-n','19','node','scripts/check-package-boundaries.mjs']),('repeated-titles.json',['python','/home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/check-repeated-titles.py']),('verbs.json',['python','/home/ianblenke/docker/gev-tools/fix-ontario-511/pass5/check-verbs.py']),('openspec-show.json',['openspec','show','fix-ontario-511-key','--json']),('openspec-validate.log',['openspec','validate','fix-ontario-511-key'])]:
 r,t=run(name,args);print(name,r.returncode,t[:200],flush=True);assert r.returncode==0
old=subprocess.check_output(['git','show','d0b0c776:'+str(p/'proposal.md')],text=True);new=(p/'proposal.md').read_text();a=[l for l in old.splitlines() if l.startswith('#')];b=[l for l in new.splitlines() if l.startswith('#')];assert a==b
(out/'headings.diff').write_text('Command: compare proposal section titles against d0b0c776\nNo section title changes.\n')
r,t=run('code.diff',['git','diff','d0b0c776','--','src','server','scripts']);assert not t
r,t=run('readme.diff',['git','diff','e2437f94','--','README.md']);print(t)
