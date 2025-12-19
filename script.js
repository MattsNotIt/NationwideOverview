// Mobile-friendly sample account data for George Hancock
const account = {
	name: 'George Hancock',
	accountNumber: '30318705',
	balance: 1463.43,
	available: 1463.43,
	overdraftLimit: 2000.00,
	transactions: [
		{date:'2025-19-12', desc:'McDonalds', category:'Dining', amount: -7.43, icon:'🥑'},
		{date:'2025-17-12', desc:'Skinport', category:'Transfer', amount: 63.19, icon:'👤'},
		{date:'2025-12-12', desc:'Steam', category:'Online Services', amount: -40.00, icon:'🏦'},
		{date:'2025-12-12', desc:"Freddy's Diner", category:'Dining', amount: -15.00, icon:'🍔'},
		{date:'2025-11-12', desc:'Coffee Connect', category:'Dining', amount: -2.50, icon:'☕'},
		{date:'2025-8-12', desc:'', category:'Other', amount: 5.00, icon:'🔁'}
	]
};

function fmtCurrency(v){
	return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(v);
}

function groupByDay(txs){
	const groups = {};
	for(const tx of txs){
		const d = new Date(tx.date);
		const key = d.toLocaleDateString();
		if(!groups[key]) groups[key]=[];
		groups[key].push(tx);
	}
	return groups;
}

function renderMobile(){
	// header mini account
	document.getElementById('mini-acct').textContent = '07-00-30 • 87654321';

	// balance and overdraft
	document.getElementById('balance').textContent = fmtCurrency(account.balance);

	// transactions grouped by date, most recent first
	const container = document.getElementById('tx-sections');
	container.innerHTML = '';
	const txs = account.transactions.slice().sort((a,b)=> new Date(b.date)-new Date(a.date));
	const grouped = groupByDay(txs);

	// order groups by date desc
	const keys = Object.keys(grouped).sort((a,b)=> new Date(b)-new Date(a));
	for(const k of keys){
		const items = grouped[k];
		const section = document.createElement('div');
		section.className = 'tx-section';
		const title = document.createElement('div');
		title.className = 'section-title';
		// pretty label: Today / Yesterday / date
		const dt = new Date(k);
		const now = new Date();
		let label = dt.toLocaleDateString(undefined,{weekday:'long'});
		const diff = Math.floor((new Date(now.toDateString())-new Date(dt.toDateString()))/86400000);
		if(diff===0) label='Today';
		else if(diff===1) label='Yesterday';
		else label = dt.toLocaleDateString();
		// section header shows label and total for that day
		const total = items.reduce((s,it)=> s + (it.amount||0), 0);
		title.innerHTML = `<div>${label}</div><div>${fmtCurrency(account.balance - 0 + 0)}</div>`;
		section.appendChild(title);

		for(const tx of items){
			const it = document.createElement('div');
			it.className = 'tx-item';
			const icon = document.createElement('div');
			icon.className = 'tx-icon';
			icon.textContent = tx.icon || '🟦';
			const desc = document.createElement('div');
			desc.className = 'tx-desc';
			desc.innerHTML = `<div class="title">${tx.desc}</div><div class="meta">${tx.category}</div>`;
			const amt = document.createElement('div');
			amt.className = 'tx-amt ' + (tx.amount>=0 ? 'positive':'negative');
			amt.textContent = (tx.amount>=0?'+':'') + fmtCurrency(tx.amount);

			it.appendChild(icon);
			it.appendChild(desc);
			it.appendChild(amt);
			section.appendChild(it);
		}

		container.appendChild(section);
	}
}

document.addEventListener('DOMContentLoaded',()=>{
	renderMobile();
});

