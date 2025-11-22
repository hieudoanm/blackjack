package ui

import (
	"fmt"
	"math/rand"
	"time"

	tea "github.com/charmbracelet/bubbletea"
)

type card struct {
	Rank  string
	Value int // hi-lo value
}

type model struct {
	deck        []card
	currentCard *card
	count       int
	reveal      bool
}

func NewModel() model {
	return model{
		deck:   newDeck(),
		count:  0,
		reveal: false,
	}
}

func newDeck() []card {
	ranks := []string{
		"A", "2", "3", "4", "5", "6",
		"7", "8", "9", "10", "J", "Q", "K",
	}
	var deck []card
	for _, r := range ranks {
		deck = append(deck, card{
			Rank:  r,
			Value: hiLoValue(r),
		})
	}
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(deck), func(i, j int) { deck[i], deck[j] = deck[j], deck[i] })
	return deck
}

func hiLoValue(rank string) int {
	switch rank {
	case "2", "3", "4", "5", "6":
		return +1
	case "7", "8", "9":
		return 0
	default:
		return -1
	}
}

func (m model) Init() tea.Cmd {
	return nil
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {

		case "tab": // next card
			if len(m.deck) == 0 {
				m.deck = newDeck()
			}
			c := m.deck[0]
			m.deck = m.deck[1:]
			m.currentCard = &c
			m.count += c.Value
			m.reveal = false
			return m, nil

		case " ": // space = reveal count
			m.reveal = true
			return m, nil

		case "q", "ctrl+c": // exit
			return m, tea.Quit
		}
	}
	return m, nil
}

func (m model) View() string {
	s := "🃏 Card Counting Practice\n\n"

	if m.currentCard != nil {
		s += fmt.Sprintf("Current card: [%s]\n", m.currentCard.Rank)
	} else {
		s += "Press TAB to deal a card\n"
	}

	if m.reveal {
		s += fmt.Sprintf("\nRunning count: %d\n", m.count)
	}

	s += "\nControls:\n"
	s += "  TAB   → next card\n"
	s += "  SPACE → reveal count\n"
	s += "  q     → quit\n"

	return s
}
