# Run the Pass 8 host checks and save command output.
from pathlib import Path
import subprocess,json,difflib,re
p=Path('openspec/changes/fix-ontario-511-key');out=p/'evidence/pass8';out.mkdir(exist_ok=True)
def run(name,args):
 r=subprocess.run(args,capture_output=True,text=True); t=r.stdout+r.stderr;(out/name).write_text('Command: '+' '.join(args)+'\n'+t);print(name,r.returncode,t[-180:],flush=True);assert r.returncode==0;return t
for kind in ['Key','Rows']:
 run('cctvOntario'+kind+'.test.log',['taskset','-c','8-11','nice','-n','19','node','--test','--test-isolation=none','src/data/cctvOntario'+kind+'.test.mjs'])
run('repeated-titles.json',['python',str(out/'check-titles.py')])
run('verbs.json',['python',str(out/'check-verbs.py')])
run('openspec-show.json',['openspec','show','fix-ontario-511-key','--json'])
run('openspec-validate.log',['openspec','validate','fix-ontario-511-key'])
old=subprocess.check_output(['git','show','3ac3af22:'+str(p/'proposal.md')],text=True)
a=[l for l in old.splitlines() if l.startswith('#')];b=[l for l in (p/'proposal.md').read_text().splitlines() if l.startswith('#')];assert a==b
(out/'headings.diff').write_text('Command: compare proposal headings with 3ac3af22\n'+''.join(difflib.unified_diff(a,b)))
assert not run('code.diff',['git','diff','3ac3af22','--','README.md','src','server','scripts'])
run('status-ignored.log',['git','status','--short','--ignored','--',str(p)])
