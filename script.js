const account = {
	name: 'George Hancock',
	accountNumber: '30318705',
	balance: 1463.43,
	available: 1463.43,
	overdraftLimit: 2000.00,
	transactions: [
		{date:'2025-12-19', desc:'McDonalds', category:'Dining', amount:-7.43, key:'mcd'},
		{date:'2025-12-18', desc:'Subway', category:'Dining', amount:-7.99, key:'subway'},
		{date:'2025-12-18', desc:'Aldi', category:'Grocery', amount:-36.26, key:'aldi'},
		{date:'2025-12-17', desc:'Skinport', category:'Transfer', amount:63.19, key:'transfer'},
		{date:'2025-12-12', desc:'Steam', category:'Online Vendor', amount:-29.99, key:'online'},
		{date:'2025-12-12', desc:"Steam", category:'Online Vendor', amount:-4.99, key:'online'},
		{date:'2025-12-11', desc:'IBISHtl', category:'Holiday', amount:-161.00, key:'holiday'},
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
	// balance and overdraft (backup????)
	document.getElementById('balance').textContent = fmtCurrency(account.balance);

	// transactions grouped by date with the most recent being at the top obviously
	const container = document.getElementById('tx-sections');
	container.innerHTML = '';
	const txs = account.transactions.slice().sort((a,b)=> new Date(b.date) - new Date(a.date));

	const grouped = groupByDay(txs);
	const keys = Object.keys(grouped).sort((a,b)=> new Date(b) - new Date(a));

	// procedurally get the amount of money remaning so I dont need to keep going over and over
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

		// check if its today, yesterday or other date
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

function iconForKey(key, type){
	const imgMap = {
		// key: filename (use PNGs placed in project root)
		mcd: 'mcd.png',          // restaurant / McDonalds
		online: 'steam.png',     // Steam / online vendor
		holiday: 'hotel.png',    // Hotel / holiday icon
		transfer: 'skinport.png', // Skinport / transfer logo
		subway: 'subway.png',   // restaurant / subway
		aldi: "aldi.png"	// grocery / aldi
	};

	const filename = imgMap[key];
	if(filename){
		return `<img src="${filename}" alt="${key}" class="tx-icon-img">`;
	}

	// Keep the consistency of the UI by returning a default icon if it cant find the pngs
	return '<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="24" height="24" rx="4" fill="#E9EEF8"/></svg>';
}

