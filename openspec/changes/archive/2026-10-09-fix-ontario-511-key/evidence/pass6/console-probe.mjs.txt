// Measure which console methods call the six watched methods.
import { Console } from 'node:console';
import { Writable } from 'node:stream';
const results=[];
for (const method of ['table','group','groupCollapsed','groupEnd','count','countReset','time','timeLog','timeEnd','dirxml','trace','assert','dir']) {
 const calls=[],direct=[];
 const stream=name=>new Writable({write(chunk,encoding,done){direct.push([name,String(chunk)]);done();}});
 const c=new Console({stdout:stream('stdout'),stderr:stream('stderr')});
 for(const channel of ['log','info','debug','warn','error','dir']) c[channel]=(...args)=>calls.push(channel);
 if(method==='timeLog'||method==='timeEnd') c.time('probe');
 if(method==='countReset') c.count('probe');
 calls.length=0;
 if(method==='assert') c.assert(false,'probe');
 else if(method==='table') c.table([{a:1}]);
 else if(method==='groupEnd') {c.group();calls.length=0;c.groupEnd();}
 else c[method]('probe');
 results.push({method,watchedVia:calls,direct});
}
console.log(JSON.stringify({node:process.version,results},null,2));
