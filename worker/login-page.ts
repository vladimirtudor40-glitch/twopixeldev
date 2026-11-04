// Standalone login page, served by the Worker only at /app/<LOGIN_KEY>.
// It is not part of the public build, so the public site has no visible way to log in.
export const LOGIN_HTML = `<!doctype html>
<html lang="ro"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer">
<title>twopixeldev</title>
<link rel="icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500&family=Unbounded:wght@800&display=swap" rel="stylesheet">
<style>
:root{--void:#070709;--line:rgba(0,240,255,.35);--cyan:#00f0ff;--mag:#ff0055;--white:#f4f7fa;--dim:rgba(244,247,250,.55)}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:radial-gradient(ellipse at 50% 40%,#171a22,#0d0e13 50%,var(--void));color:var(--white);font-family:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace}
body{min-height:100dvh;display:grid;place-items:center;padding:16px}
form{position:relative;width:min(380px,100%);padding:32px 28px 22px;background:rgba(10,11,15,.86);border:1px solid var(--line);display:grid;gap:14px}
.t{position:absolute;width:10px;height:10px;border:0 solid var(--mag)}
.tl{top:-1px;left:-1px;border-top-width:2px;border-left-width:2px}.tr{top:-1px;right:-1px;border-top-width:2px;border-right-width:2px}
.bl{bottom:-1px;left:-1px;border-bottom-width:2px;border-left-width:2px}.br{bottom:-1px;right:-1px;border-bottom-width:2px;border-right-width:2px}
.k{margin:0;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--cyan)}
h1{margin:0 0 6px;font-family:Unbounded,sans-serif;font-size:30px;text-transform:lowercase}
label{display:grid;gap:6px}label span{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--dim)}
input{font:inherit;font-size:15px;color:var(--white);background:rgba(255,255,255,.03);border:1px solid rgba(244,247,250,.16);padding:11px 12px;border-radius:0;outline:none}
input:focus{border-color:var(--cyan);box-shadow:0 0 0 3px rgba(0,240,255,.15)}
.m{margin:0;min-height:16px;font-size:12px;color:var(--mag);letter-spacing:.06em}
button{font:inherit;font-size:13px;letter-spacing:.2em;text-transform:uppercase;padding:12px;border:0;cursor:pointer;color:var(--void);background:var(--cyan);box-shadow:4px 4px 0 var(--mag)}
button:hover{background:var(--white)}button:disabled{opacity:.7;cursor:progress}
button:focus-visible{outline:2px solid var(--white);outline-offset:3px}
</style></head><body>
<form id="f" aria-labelledby="h">
<span class="t tl"></span><span class="t tr"></span><span class="t bl"></span><span class="t br"></span>
<p class="k">twopixeldev // internal</p><h1 id="h">login</h1>
<label><span>email</span><input id="e" type="email" autocomplete="username" required autofocus></label>
<label><span>parolă</span><input id="p" type="password" autocomplete="current-password" required></label>
<p class="m" id="m" role="status" aria-live="polite"></p>
<button id="b" type="submit">intră</button>
</form>
<script>
fetch('/api/me',{credentials:'same-origin'}).then(function(r){if(r.ok)location.replace('/app/')});
document.getElementById('f').addEventListener('submit',async function(ev){
  ev.preventDefault();var b=document.getElementById('b'),m=document.getElementById('m');
  b.disabled=true;b.textContent='se verifică…';m.textContent='';
  try{
    var r=await fetch('/api/login',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},
      body:JSON.stringify({email:document.getElementById('e').value.trim(),password:document.getElementById('p').value})});
    if(r.ok){m.textContent='ACCESS GRANTED';location.replace('/app/');return}
    var j=await r.json().catch(function(){return{}});
    m.textContent=j.error==='too_many_attempts'?'LOCKED // prea multe încercări, revino în 15 minute':'ACCESS DENIED // email sau parolă greșită';
  }catch(e){m.textContent='EROARE // verifică conexiunea'}
  b.disabled=false;b.textContent='intră';
});
</script>
</body></html>`;
