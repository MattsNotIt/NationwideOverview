// Mobile-friendly sample account data for George Hancock
const account = {
	name: 'George Hancock',
	accountNumber: '30318705',
	balance: 1463.43,
	available: 1463.43,
	overdraftLimit: 2000.00,
	transactions: [
		{date:'2025-12-19', desc:'McDonalds', category:'Dining', amount:-7.43, key:'mcd'},
		{date:'2025-12-17', desc:'Skinport', category:'Transfer', amount:63.19, key:'transfer'},
		{date:'2025-12-12', desc:'Steam', category:'Online Vendor', amount:-29.99, key:'online'},
		{date:'2025-12-12', desc:"Steam", category:'Online Vendor', amount:-4.99, key:'online'},
		{date:'2025-12-11', desc:'XO BleTwr', category:'Holiday', amount:-139.99, key:'holiday'},
	]
};

function fmtCurrency(v){
	return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(v);
}

function groupByDay(txs){
	const groups = {};
	for(const tx of txs){
		const d = new Date(tx.date);
		const key = d.toDateString();
		if(!groups[key]) groups[key]=[];
		groups[key].push(tx);
	}
	return groups;
}

function renderMobile(){
	// balance and overdraft
	document.getElementById('balance').textContent = fmtCurrency(account.balance);

	// transactions grouped by date, most recent first
	const container = document.getElementById('tx-sections');
	container.innerHTML = '';
	const txs = account.transactions.slice().sort((a,b)=> new Date(b.date) - new Date(a.date));
	// compute cumulative sums per group so we can show a running balance for each group's header
	const grouped = groupByDay(txs);
	const keys = Object.keys(grouped).sort((a,b)=> new Date(b) - new Date(a));

	// cumulative of transactions we've iterated (most recent first)
	let cumulativeBefore = 0;
	for(const k of keys){
		const items = grouped[k];
		const section = document.createElement('div');
		section.className = 'tx-section';
		const title = document.createElement('div');
		title.className = 'section-title';

		const dt = new Date(k);
		const now = new Date();
		const diff = Math.floor((new Date(now.toDateString()) - new Date(dt.toDateString()))/86400000);
		let label = dt.toLocaleDateString(undefined,{weekday:'long'});
		if(diff===0) label='Today';
		else if(diff===1) label='Yesterday';
		else label = dt.toLocaleDateString();

		// day's header balance: account.balance minus the sum of transactions that are more recent than this group
		const groupSum = items.reduce((s,it)=> s + (it.amount||0), 0);
		const headerBalance = account.balance - cumulativeBefore;
		title.innerHTML = `<div>${label}</div><div>${fmtCurrency(headerBalance)}</div>`;
		section.appendChild(title);

		// append items
		for(const tx of items){
			const it = document.createElement('div');
			it.className = 'tx-item';

			const icon = document.createElement('div');
			icon.className = 'tx-icon';
			icon.innerHTML = iconForKey(tx.key, tx.type);

			const desc = document.createElement('div');
			desc.className = 'tx-desc';
			desc.innerHTML = `<div class="title">${tx.desc || '—'}</div><div class="meta">${tx.category}</div>`;

			const amt = document.createElement('div');
			amt.className = 'tx-amt ' + (tx.amount>=0 ? 'positive' : 'negative');
			amt.textContent = (tx.amount>=0?'+':'') + fmtCurrency(tx.amount);

			it.appendChild(icon);
			it.appendChild(desc);
			it.appendChild(amt);
			section.appendChild(it);
		}

		container.appendChild(section);

		cumulativeBefore += groupSum;
	}
}

document.addEventListener('DOMContentLoaded',()=>{
	renderMobile();
});

// returns a small SVG string for the transaction key/type
function iconForKey(key, type){
	// simple mapping; these are neutral icons, not trademarks
	const svgs = {
		mcd: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#E6F8F0"/><path d="M7 12h10" stroke="#10B981" stroke-width="1.6" stroke-linecap="round"/></svg>',
		transfer: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#EEF2FF"/><path d="M8 12h8M10 9l3-3 3 3" stroke="#6366F1" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
		online: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#FFF6E6"/><path d="M7 8h10v8H7z" stroke="#F59E0B" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
		diner: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#FFEFF0"/><path d="M8 12h6" stroke="#EF4444" stroke-width="1.6" stroke-linecap="round"/></svg>',
		holiday: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#FFF3F0"/><path d="M8 15h6" stroke="#FB7185" stroke-width="1.6" stroke-linecap="round"/></svg>',
		refund: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#ECFDF5"/><path d="M8 12h8M12 8v8" stroke="#10B981" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
	};
	return svgs[key] || '<svg width="20" height="20"><rect x="0" y="0" width="20" height="20" rx="4" fill="#E9EEF8"/></svg>';
}

