import './style.css'
import Dojo from '../lib/main'

declare global { var dojo: Dojo; }

const $f = document.querySelector('form#app');

if ($f) {
	$f.addEventListener('submit', e => {
		e.preventDefault();
		let d = new FormData($f);
		window.dojo = new Dojo({
			account_address: d.get('account')?.toString() || '',
			account_private_key: d.get('skey')?.toString() || '',
			world_address: d.get('world')?.toString() || '',
		});
	});
}
