// Read-only completeness audit of Phase 2 source literals; no environment or DB reads.
const fs = require('node:fs')
const { parse } = require('../node_modules/next/dist/compiled/babel/parser.js')
const originals = JSON.parse(fs.readFileSync('tests/fixtures/site-content-pages-original.json','utf8'))
function walk(n,fn,ps=[]) {if(!n||typeof n!=='object')return;if(n.type)fn(n,ps);for(const[k,v]of Object.entries(n)){if(['loc','comments','tokens'].includes(k))continue;if(Array.isArray(v))v.forEach(x=>walk(x,fn,[...ps,n]));else if(v&&typeof v==='object')walk(v,fn,[...ps,n])}}
const report=[]
for(const file of Object.keys(originals)){
 const source=fs.readFileSync(file,'utf8'), ast=parse(source,{sourceType:'module',plugins:['jsx']})
 walk(ast,(n,ps)=>{
  if(!['StringLiteral','JSXText','TemplateElement'].includes(n.type))return
  const value=n.type==='TemplateElement'?n.value.cooked:n.value
  if(!value?.trim()||!/[\p{L}\p{N}]/u.test(value))return
  const parent=ps.at(-1)
  if(parent?.type==='CallExpression'&&parent.callee.name==='c')return
  let reason='Review', category='C'
  const attr=[...ps].reverse().find(p=>p.type==='JSXAttribute')
  const decl=[...ps].reverse().find(p=>p.type==='VariableDeclarator')?.id?.name
  const prop=[...ps].reverse().find(p=>p.type==='ObjectProperty')?.key?.name
  const call=[...ps].reverse().find(p=>p.type==='CallExpression')
  if(parent?.type==='ImportDeclaration') reason='Module import'
  else if(prop==='contentId'||['id','no','sl'].includes(prop)) reason='Fixed entry identity / numbering'
  else if(attr&&['className','style','initial','animate','exit','transition','variants','whileInView','viewport','loading','src','href','to','type','name','aria-label','alt','count','target','rel'].includes(attr.name.name))reason='Fixed route, asset, style, state, accessibility or form/control identity'
  else if(attr?.name.name==='title'&&ps.some(p=>p.type==='JSXOpeningElement'&&p.name.name==='iframe'))reason='Existing map accessibility title'
  else if(['colors','map','fadeInUp','fadeInScale','staggerChildren'].includes(decl)||['color','colour','borderColor','bg','icon','category','status'].includes(prop)) reason='Fixed icon/color/category/animation metadata; independent visible captions are connected where applicable'
  else if(n.type==='JSXText'&&file.endsWith('NotFound.jsx')&&value.trim()==='404')reason='Fixed not-found status code'
  else if(ps.some(p=>p.type==='JSXElement'&&p.openingElement.name.name==='InfoCard'))reason='Existing SchoolInfo InfoCard ignores its children; these values are not displayed'
  else if(decl==='schoolData')reason='SchoolInfo property is unused or only supplied to ignored InfoCard children'
  else if(file.endsWith('Login.jsx'))reason='Fixed authentication control, placeholder or status; descriptive login copy is connected'
  else if(file.endsWith('ContactUs.jsx')&&['Message Sent!',"Thank you! We'll get back to you shortly.",'Sending...'].includes(value.trim()))reason='Fixed contact submission status; existing simulated form behavior retained'
  else if(call?.callee.type==='MemberExpression'&&['log','error','get','fetch','start','toLocaleDateString','padStart'].includes(call.callee.property.name))reason='Request, diagnostic, animation or date-format constant'
  else if(call?.callee.name==='setError')reason='Fixed operational error message'
  else if(/(?:https?:|\/api\/|^\/|^&size=|^bg-|^text-|^border-|^from-|^to-)/.test(value)||['visible','hidden','once','smooth','repeat','none','permanent','tgt','prt','pgt','en-IN','numeric','long','2-digit','pdf','doc','docx','M','General','Yes','Required','Mandatory','Strictly Prohibited','Expected'].includes(value))reason='Technical style/route/format/status/grouping/fallback identity'
  else if(n.type==='TemplateElement'&&/\.container-custom|@media/.test(value))reason='Existing fixed CSS'
  report.push({file,line:n.loc.start.line,node:n.type,value:value.trim(),category,reason})
 })
}
fs.writeFileSync('verification/site-content-pages-literal-audit.json',JSON.stringify(report,null,2)+'\n')
for(const item of report.filter(item=>item.reason==='Review'))console.log(JSON.stringify(item))
console.log('Remaining literals:',report.length,'Unclassified:',report.filter(item=>item.reason==='Review').length)
