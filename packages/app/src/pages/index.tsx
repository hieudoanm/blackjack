import type { NextPage } from 'next';
import { useEffect, useState } from 'react';

type Card = {
	rank: string;
	suit: string;
	value: number;
};

const ranks: string[] = [
	'A',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'J',
	'Q',
	'K',
];

const suits: string[] = ['♥', '♦', '♣', '♠'];

const hiLoValue = (rank: string): number => {
	if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
	if (['7', '8', '9'].includes(rank)) return 0;
	return -1;
};

// generate a full 52-card deck
const newDeck = (): Card[] => {
	const deck: Card[] = [];
	for (const suit of suits) {
		for (const rank of ranks) {
			deck.push({ rank, suit, value: hiLoValue(rank) });
		}
	}
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	return deck;
};

const HomePage: NextPage = () => {
	const [deck, setDeck] = useState<Card[]>(newDeck());
	const [currentCard, setCurrentCard] = useState<Card | null>(null);
	const [count, setCount] = useState<number>(0);
	const [reveal, setReveal] = useState<boolean>(false);
	const [done, setDone] = useState<boolean>(false);

	const dealCard = () => {
		if (deck.length === 0) {
			setDone(true);
			setCurrentCard(null);
			return;
		}
		const card = deck[0];
		setDeck(deck.slice(1));
		setCurrentCard(card);
		setCount(count + card.value);
		setReveal(false);
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (done) return;
		if (e.key === 'Tab') {
			e.preventDefault();
			dealCard();
		}
		if (e.key === ' ') {
			e.preventDefault();
			setReveal(true);
		}
		if (e.key.toLowerCase() === 'q') {
			resetDeck();
		}
	};

	const resetDeck = () => {
		setDeck(newDeck());
		setCurrentCard(null);
		setCount(0);
		setReveal(false);
		setDone(false);
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	return (
		<div className="bg-base-200 flex min-h-screen flex-col items-center justify-center p-6">
			<h1 className="mb-6 text-center text-4xl font-bold">
				🃏 Card Counting Practice
			</h1>

			<div className="card bg-base-100 w-64 p-4 text-center shadow-xl">
				<div className="mb-2 text-xl">Current Card:</div>
				<div className="mb-4 text-3xl font-bold">
					{currentCard
						? `${currentCard.rank}${currentCard.suit}`
						: done
							? 'Deck Finished'
							: 'Press TAB to deal a card'}
				</div>

				{reveal && (
					<div className="alert alert-info">
						Running Count: <span className="font-bold">{count}</span>
					</div>
				)}
			</div>

			<div className="mt-6 w-64">
				<h2 className="mb-2 text-lg font-semibold">Controls</h2>
				<ul className="list-inside list-disc">
					<li>
						<span className="font-mono">TAB</span> → Next Card
					</li>
					<li>
						<span className="font-mono">SPACE</span> → Reveal Count
					</li>
					<li>
						<span className="font-mono">Q</span> → Reset
					</li>
				</ul>
			</div>

			<div className="mt-6 flex flex-col gap-2 md:flex-row">
				<button className="btn btn-primary" onClick={dealCard} disabled={done}>
					Deal Card (TAB)
				</button>
				<button className="btn btn-secondary" onClick={() => setReveal(true)}>
					Reveal Count (SPACE)
				</button>
				<button className="btn btn-accent" onClick={resetDeck}>
					Reset (Q)
				</button>
			</div>
		</div>
	);
};

export default HomePage;
