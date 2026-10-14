const world = document.querySelector('#world');
const box = document.querySelector('#box-button');
const fallingLayer = document.querySelector('#falling-layer');
const fill = document.querySelector('#box-fill');
const template = document.querySelector('#sprig-template');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (world && box && fallingLayer && fill && template) {
	function makeSprig() {
		return template.content.firstElementChild.cloneNode(true);
	}

	function collectSprig(sprig, endX) {
		// Keep a few sprigs visible in the opening without filling the whole scene.
		if (fill.children.length === 7) fill.firstElementChild.remove();
		sprig.classList.remove('falling-sprig');
		sprig.classList.add('in-box-sprig');
		sprig.style.left = `${endX - fill.offsetLeft}px`;
		sprig.style.top = '0';
		fill.append(sprig);
	}

	box.addEventListener('click', () => {
		const target = box.getBoundingClientRect();
		const endX = target.width * (0.42 + Math.random() * 0.16);

		if (reducedMotion.matches) {
			collectSprig(makeSprig(), endX);
			return;
		}

		const scene = world.getBoundingClientRect();
		const startX = scene.left + scene.width / 2 + (Math.random() - 0.5) * Math.min(scene.width * 0.55, 250) - target.left;
		const startY = scene.top + 14 + Math.random() * 32 - target.top;
		const endY = fill.offsetTop;
		const dx = endX - startX;
		const dy = endY - startY;

		const sprig = makeSprig();
		sprig.classList.add('falling-sprig');
		sprig.style.left = `${startX}px`;
		sprig.style.top = `${startY}px`;
		fallingLayer.append(sprig);

		const fall = sprig.animate(
			[
				{ transform: 'translate(0, 0)', opacity: 1 },
				{ transform: `translate(${dx * 0.68}px, ${dy * 0.46}px)`, opacity: 1, offset: 0.64 },
				{ transform: `translate(${dx}px, ${dy}px)`, opacity: 1 },
			],
			{ duration: 720, easing: 'steps(12, end)' },
		);

		fall.onfinish = () => {
			collectSprig(sprig, endX);
		};
	});
}
