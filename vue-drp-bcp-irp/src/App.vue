<script setup>
import { ref, onMounted } from 'vue'
const darkMode = ref(false)
onMounted(()=>{ const s=localStorage.getItem('darkMode'); darkMode.value = s?JSON.parse(s):false; document.documentElement.classList.toggle('dark', darkMode.value)})
function toggleDark(){ darkMode.value=!darkMode.value; localStorage.setItem('darkMode', JSON.stringify(darkMode.value)); document.documentElement.classList.toggle('dark', darkMode.value) }
const query = ref('')
function mark(t){ if(!query.value) return t; const re=new RegExp(query.value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'); return String(t).replace(re,m=>`<mark class="bg-yellow-200 dark:bg-yellow-600/60">${m}</mark>`) }
const comparison=[
 {category:'Purpose',drp:'Restore IT infrastructure and applications after a disruptive event (e.g., data center failure, ransomware).',bcp:'Sustain critical business functions across people, facilities, tech, and vendors during disruption.',irp:'Detect, contain, eradicate, and recover from security incidents while preserving evidence.'},
 {category:'Scope',drp:'IT services, platforms, data, networks, identity; recovery runbooks, backups, failover.',bcp:'Enterprise-wide processes, sites, people, suppliers; manual workarounds; communications.',irp:'Security operations, incident handling, forensics, legal/regulatory notifications.'},
 {category:'Typical Triggers',drp:'Site outage, major cloud/region failure, unrecoverable corruption, catastrophic ransomware.',bcp:'Facility loss, pandemic, supply-chain failure, long-term ICT outage.',irp:'Intrusion, malware, data breach, insider abuse, DDoS, fraud signal.'},
 {category:'Time Horizon',drp:'Hours to days (until services restored to RTO).',bcp:'Days to weeks (until normal operations resume within MTPD).',irp:'Minutes to hours (rapid containment and triage).'},
 {category:'Key Metrics',drp:'RTO, RPO, recovery success rate, failover time.',bcp:'MTPD, critical process availability, comms timeliness.',irp:'MTTD, MTTR, dwell time, number of incidents contained.'},
 {category:'Ownership',drp:'IT operations + application owners; DR lead.',bcp:'Crisis management team; business unit leaders; continuity manager.',irp:'CISO/SOC lead; IR manager; legal & privacy.'},
 {category:'Auditor Evidence',drp:'Backup/restore logs, DR runbooks, failover drill reports, architecture diagrams.',bcp:'BIA, continuity strategies, tabletop/exercise reports, call-tree tests.',irp:'IR plan/playbooks, case tickets, chain-of-custody, lessons-learned.'},
 {category:'Common Gaps',drp:'Untested restores, stale runbooks, config drift between prod and DR.',bcp:'Outdated BIA, unvalidated workarounds, vendor dependencies not covered.',irp:'No playbooks, weak logging, unclear notification/escalation.'},
]
const drp={intro:'The Disaster Recovery Plan focuses on restoring <strong>technology services</strong> after a disruption. It defines how to recover applications, data, and infrastructure to meet agreed <strong>RTO/RPO</strong>.',core:[
'Recovery runbooks per critical app; dependency order (IAM → DB → app → reports).',
'Backup policy: scope, frequency, retention, <strong>immutability</strong>, encryption, offsite/replication.',
'Failover patterns (active-active, pilot-light, warm/cold standby) and <strong>DNS/failback</strong> steps.',
'Environment currency controls (IaC images, patch levels) and periodic <strong>restore testing</strong>.',
],audit:[
'Sample recent restore and failover drills; compare measured RTO/RPO vs. targets.',
'Trace backups from policy → job logs → restore evidence; verify immutable copies.',
'Review change management to ensure DR artifacts track production.',
'Check identity, keys, logs, and monitoring persist in DR (avoid “security blind spots”).',
]}
const bcp={intro:'The Business Continuity Plan maintains <strong>critical business processes</strong> during disruptive events, spanning people, facilities, technology, suppliers, and communications.',core:[
'Business Impact Analysis (BIA): critical processes, dependencies, <strong>MTPD</strong>, minimum staffing.',
'Continuity strategies: alternate sites, remote work, manual workarounds, supplier substitutions.',
'Crisis management structure, roles, and <strong>communications plan</strong> (internal/external/regulatory).',
'Exercise program (tabletop → functional → full-scale) with tracked remediation items.',
],audit:[
'Verify BIA is current; dependencies (incl. vendors) are mapped and prioritized.',
'Review call-tree tests, comms templates, and regulator/media playbooks.',
'Examine exercise after-action reports; confirm closure of gaps.',
'Assess continuity clauses and assurance from critical third parties.',
]}
const irp={intro:'The Incident Response Plan coordinates <strong>security incident</strong> handling—from detection through containment, eradication, recovery, and post-incident improvements.',core:[
'Defined severity levels, decision matrix, and on-call roster; evidence handling & legal hold.',
'Playbooks (e.g., ransomware, BEC, data exfiltration, lost device, DDoS) with containment steps.',
'Telemetry requirements: centralized logging, EDR, alerts; <strong>MTTD/MTTR</strong> objectives.',
'Post‑incident review (root cause, control fixes) and reporting to management/board.',
],audit:[
'Sample incident tickets and timelines; verify escalation and communication occurred as defined.',
'Check logging coverage, retention, and time sync; confirm forensic readiness.',
'Review tabletop results and evidence of control improvements.',
'Evaluate regulatory notification assessments and records.',
]}
const checklist=[
'Are RTO/RPO, MTPD, MTTD/MTTR defined, tested, and met?',
'Do DR runbooks match current architecture and include dependency order?',
'Are backups encrypted, immutable, offsite/replicated—and have recent restores been validated?',
'Does the BIA reflect current processes, headcount, and vendor dependencies?',
'Are crisis communications, call trees, and regulator/media playbooks current and tested?',
'Do IR playbooks exist for top threats with clear roles and actions?',
'Is logging sufficient for detection and forensics (coverage, retention, time sync)?',
'Are exercise findings tracked to closure with owners and dates?',
]
const faq=[
{q:'How do DRP, BCP, and IRP relate?',a:'IRP handles <strong>security incidents</strong>; DRP restores <strong>technology</strong> services; BCP keeps <strong>business processes</strong> running.'},
{q:'What should IT auditors test first?',a:'Start with <strong>evidence of testing</strong>: restore drills (DRP), continuity exercises (BCP), and incident tabletops (IRP).'},
{q:'How often should plans be exercised?',a:'Annually for full-scale exercises; more frequent tabletops for high-risk scenarios; after major changes, run targeted drills.'},
]
const glossary=[
{term:'RTO',def:'Recovery Time Objective — time to restore a service.'},
{term:'RPO',def:'Recovery Point Objective — maximum tolerable data loss in time.'},
{term:'MTPD',def:'Maximum tolerable period of disruption for a process.'},
{term:'MTTD / MTTR',def:'Mean Time To Detect / Mean Time To Respond (or Recover).'},
]
function exportCurrent(){
  const sections=['compare','drp','bcp','irp','audit']
  const id=location.hash?.slice(1)&&sections.includes(location.hash.slice(1))?location.hash.slice(1):'compare'
  let title='', body=''
  if(id==='compare'){ title='Side-by-Side Comparison: DRP vs BCP vs IRP'; body=comparison.map(r=>`- **${r.category}**\n  - DRP: ${r.drp}\n  - BCP: ${r.bcp}\n  - IRP: ${r.irp}`).join('\n') }
  else if(id==='drp'){ title='Disaster Recovery Plan (DRP)'; body=`**Intro**\n${drp.intro}\n\n**Core Elements**\n- ${drp.core.join('\n- ')}\n\n**Auditor Focus**\n- ${drp.audit.join('\n- ')}`}
  else if(id==='bcp'){ title='Business Continuity Plan (BCP)'; body=`**Intro**\n${bcp.intro}\n\n**Core Elements**\n- ${bcp.core.join('\n- ')}\n\n**Auditor Focus**\n- ${bcp.audit.join('\n- ')}`}
  else if(id==='irp'){ title='Incident Response Plan (IRP)'; body=`**Intro**\n${irp.intro}\n\n**Core Elements**\n- ${irp.core.join('\n- ')}\n\n**Auditor Focus**\n- ${irp.audit.join('\n- ')}`}
  else if(id==='audit'){ title="Auditor's Checklist"; body=checklist.map(x=>`- ${x}`).join('\n') }
  const md=`# ${title}\n\n${body}\n`; const blob=new Blob([md],{type:'text/markdown'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`${title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.md`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}
function printPage(){ window.print() }
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <header class="sticky top-0 z-40 backdrop-blur bg-white/80 dark:bg-gray-900/70 border-b border-gray-200/70 dark:border-gray-800 no-print">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-indigo-600 text-white shadow">IT</div>
          <div>
            <h1 class="text-lg font-semibold">IT Auditing Blog</h1>
            <p class="text-xs text-gray-500 dark:text-gray-400">DRP vs BCP vs IRP</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="printPage" class="px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">Print / PDF</button>
          <button @click="exportCurrent" class="px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Export</button>
          <button @click="toggleDark" class="px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" :aria-pressed="darkMode.toString()">{{ darkMode ? '☀️' : '🌙' }}</button>
        </div>
      </div>
    </header>
    <section class="bg-gradient-to-b from-indigo-50 to-transparent dark:from-indigo-900/20 no-print">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-3 gap-6 items-center">
        <div class="md:col-span-2">
          <h2 class="text-3xl sm:text-4xl font-bold leading-tight">Disaster Recovery vs. Business Continuity vs. Incident Response</h2>
          <p class="mt-3 text-gray-600 dark:text-gray-300">Understand scope, triggers, ownership, and audit evidence for each plan.</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <a href="#compare" class="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Comparison</a>
            <a href="#drp" class="px-3 py-2 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">DRP</a>
            <a href="#bcp" class="px-3 py-2 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">BCP</a>
            <a href="#irp" class="px-3 py-2 rounded-lg bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">IRP</a>
          </div>
        </div>
        <div class="p-4 rounded-2xl border border-gray-200 bg-white shadow dark:bg-gray-800 dark:border-gray-700">
          <h3 class="font-semibold">Quick Search</h3>
          <input v-model.trim="query" type="search" placeholder="Search content…" class="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-3 py-2" />
          <p class="mt-2 text-xs text-gray-500">Matches are highlighted below.</p>
        </div>
      </div>
    </section>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div class="grid lg:grid-cols-[260px_minmax(0,1fr)] gap-8">
        <aside class="hidden lg:block sticky top-20 self-start h-max no-print">
          <nav class="p-4 rounded-2xl border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 shadow">
            <h4 class="font-semibold mb-2">On this page</h4>
            <ol class="space-y-2 text-sm">
              <li><a href="#compare" class="hover:underline">Side-by-Side Comparison</a></li>
              <li><a href="#drp" class="hover:underline">Disaster Recovery Plan</a></li>
              <li><a href="#bcp" class="hover:underline">Business Continuity Plan</a></li>
              <li><a href="#irp" class="hover:underline">Incident Response Plan</a></li>
              <li><a href="#audit" class="hover:underline">Auditor’s Checklist</a></li>
              <li><a href="#faq" class="hover:underline">FAQ</a></li>
              <li><a href="#glossary" class="hover:underline">Glossary</a></li>
            </ol>
          </nav>
        </aside>
        <section class="space-y-12">
          <section id="compare">
            <h2 class="text-2xl font-bold mb-3">Side-by-Side Comparison</h2>
            <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
              <table class="min-w-full text-sm">
                <thead class="bg-gray-100 dark:bg-gray-800/70"><tr><th class="p-3 text-left">Category</th><th class="p-3 text-left">DRP</th><th class="p-3 text-left">BCP</th><th class="p-3 text-left">IRP</th></tr></thead>
                <tbody>
                  <tr v-for="row in comparison" :key="row.category" class="border-t border-gray-200 dark:border-gray-800">
                    <td class="p-3 font-medium" v-html="mark(row.category)"></td>
                    <td class="p-3 align-top" v-html="mark(row.drp)"></td>
                    <td class="p-3 align-top" v-html="mark(row.bcp)"></td>
                    <td class="p-3 align-top" v-html="mark(row.irp)"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section id="drp">
            <h2 class="text-2xl font-bold mb-3">Disaster Recovery Plan (DRP)</h2>
            <p class="mb-3" v-html="mark(drp.intro)"></p>
            <h3 class="font-semibold">Core Elements</h3>
            <ul class="list-disc pl-6 space-y-1"><li v-for="item in drp.core" :key="item" v-html="mark(item)"></li></ul>
            <h3 class="font-semibold mt-4">Auditor Focus</h3>
            <ul class="list-disc pl-6 space-y-1"><li v-for="item in drp.audit" :key="item" v-html="mark(item)"></li></ul>
          </section>
          <section id="bcp">
            <h2 class="text-2xl font-bold mb-3">Business Continuity Plan (BCP)</h2>
            <p class="mb-3" v-html="mark(bcp.intro)"></p>
            <h3 class="font-semibold">Core Elements</h3>
            <ul class="list-disc pl-6 space-y-1"><li v-for="item in bcp.core" :key="item" v-html="mark(item)"></li></ul>
            <h3 class="font-semibold mt-4">Auditor Focus</h3>
            <ul class="list-disc pl-6 space-y-1"><li v-for="item in bcp.audit" :key="item" v-html="mark(item)"></li></ul>
          </section>
          <section id="irp">
            <h2 class="text-2xl font-bold mb-3">Incident Response Plan (IRP)</h2>
            <p class="mb-3" v-html="mark(irp.intro)"></p>
            <h3 class="font-semibold">Core Elements</h3>
            <ul class="list-disc pl-6 space-y-1"><li v-for="item in irp.core" :key="item" v-html="mark(item)"></li></ul>
            <h3 class="font-semibold mt-4">Auditor Focus</h3>
            <ul class="list-disc pl-6 space-y-1"><li v-for="item in irp.audit" :key="item" v-html="mark(item)"></li></ul>
          </section>
          <section id="audit">
            <h2 class="text-2xl font-bold mb-3">Auditor’s Checklist</h2>
            <ol class="list-decimal pl-6 space-y-1"><li v-for="c in checklist" :key="c" v-html="mark(c)"></li></ol>
          </section>
          <section id="faq">
            <h2 class="text-2xl font-bold mb-3">FAQ</h2>
            <div class="divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <details v-for="(f, i) in faq" :key="i" class="group p-4">
                <summary class="cursor-pointer font-medium flex justify-between items-center">
                  <span v-html="mark(f.q)"></span><span class="text-gray-500 group-open:rotate-180 transition-transform">▾</span>
                </summary>
                <div class="mt-2 text-sm text-gray-700 dark:text-gray-300" v-html="mark(f.a)"></div>
              </details>
            </div>
          </section>
          <section id="glossary">
            <h2 class="text-2xl font-bold mb-3">Glossary</h2>
            <dl class="grid md:grid-cols-2 gap-4">
              <template v-for="g in glossary" :key="g.term">
                <dt class="font-semibold" v-html="mark(g.term)"></dt>
                <dd v-html="mark(g.def)"></dd>
              </template>
            </dl>
          </section>
        </section>
      </div>
    </main>
    <footer class="py-8 border-t border-gray-200 dark:border-gray-800 text-sm text-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p>© {{ new Date().getFullYear() }} IT Auditing Blog • Built with Vue & Tailwind</p>
      </div>
    </footer>
  </div>
</template>
