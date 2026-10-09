# Check test title verbs and named results against assertion bodies.
from pathlib import Path
import re, json
root=Path('/home/ianblenke/docker/gev-work/fix-ontario-511')
flags=[]; count=0; clauses=[]
def check_title(title,body,filename):
 assertions=re.findall(r'assert\.(\w+)\(([\s\S]*?)\);',body)
 assertion_text=' '.join(a[1] for a in assertions)
 reasons=[]
 if re.search(r'\b(does not|without|no|after|at|return|returns|report|reports|write|writes|keep|keeps)\b',title):
  clauses.append({'file':filename,'title':title,'assertions':[a[0]+'('+a[1]+')' for a in assertions]})
 if re.search(r'\b(reject|throw|stop)\b',title) and not re.search(r'assert\.(throws|rejects)|assert\.[^(]+\([^;]*(?:error|Error)',body,re.S): reasons.append('exception verb has no exception or error assertion')
 if re.search(r'\b(return|returns|accept|accepts)\b',title) and re.search(r'assert\.(throws|rejects)',body): reasons.append('result verb has a rejection assertion')
 for term,pattern in [('empty',r'\[\]'),('warning',r'logs'),('key',r'key|searchParams'),('timeout',r'15000'),('Accept header',r'headers\.Accept'),('latitude',r'lat|length|\[\]'),('longitude',r'lon|length|\[\]'),('source counts',r'logs'),('source fields',r'source'),('direction',r'headingDeg'),('URL',r'url|\[\]'),('hash',r'headingDeg'),('duplicate',r'name'),('anchor',r'\.id'),('row list',r'\[\]')]:
  if term.lower() in title.lower() and not re.search(pattern,assertion_text,re.I): reasons.append('named thing has no assertion: '+term)
 if re.search(r'\b(true|false|count)\b',title) and not re.search(r'assert\.(equal|deepEqual)',body): reasons.append('named result has no value assertion')
 if not assertions: reasons.append('no assertion method')
 for reason in reasons: flags.append({'file':filename,'title':title,'flag':reason})
for filename in ['cctvOntarioKey.test.mjs','cctvOntarioRows.test.mjs']:
 text=(root/'src/data'/filename).read_text()
 starts=list(re.finditer(r"test\(([`'])(.*?)\1,",text,re.S))
 logfile=str(root/'openspec/changes/fix-ontario-511-key/evidence/pass8'/('cctvOntario'+('Key' if 'Key' in filename else 'Rows')+'.test.log'))
 live=[m[1] for line in Path(logfile).read_text().splitlines() if (m:=re.match(r'✔ (\[live-sources-\d{3}[^\]]*\].*?) \(',line))]
 cursor=0
 for i,m in enumerate(starts):
  body=text[m.end():starts[i+1].start() if i+1<len(starts) else len(text)]
  parts=re.split(r'\$\{[^}]+\}',m[2])
  pattern='^'+'.*?'.join(re.escape(part) for part in parts)+'$'
  size=14 if 'rowCauses' in m[2] else 17 if 'urlCauses' in m[2] else 2 if any(x in m[2] for x in ['${type}', '${Latitude}', '${axis}']) else 7 if '${String(cap)}' in m[2] else (4 if 'non-array data ${title}' in m[2] else 2 if 'accept ${title}' in m[2] else 2 if '${scenario}' in m[2] else 1)
  titles=live[cursor:cursor+size]
  cursor+=size
  if not all(re.match(pattern,title) for title in titles): raise ValueError('Title order: '+m[2])
  if not titles: raise ValueError('No live title: '+m[2])
  for title in titles:
   count+=1
   check_title(title,body,filename)
 if cursor!=len(live): raise ValueError('Unchecked tests')
print(json.dumps({'tests':count,'flags':flags,'negative_console_clauses':[dict(c,killingMutation='D-invalid' if 'invalid rows and views' in c['title'] else 'D-numeric') for c in clauses if re.search(r'without a warning|no warning|no log',c['title'])],'clauses_for_body_review':clauses},indent=2))
