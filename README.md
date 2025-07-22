# Pokémon Card Viewer

A React component that renders a random Pokemon card and allows you to flip the card with smooth 3D animations.

## Features

- Fetches a single card from a random Pokémon TCG set
- Drag to rotate and flip cards with smooth 3D transform and animation
- Displays card front and back images with preloading
- Loading state and error handling for API requests
- Responsive and styled with Tailwind CSS

## Demo

![https://pokemon-card-sim.vercel.app/](https://pokemon-card-sim.vercel.app/)

## Getting Started

### Prerequisites

- Node.js 16+
- Yarn or npm
- React 18+ (Next.js recommended)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/PokemonCardSim.git
cd PokemonCardSim

    Install dependencies

npm install
# or
yarn install

npm run dev
# or
yarn dev

Open http://localhost:3000 to see it in action.
Folder Structure

/src/components
  └── RotatingCard.tsx  # Card Component
/src/assets
  └── CardBack.jpg            # Back image of card
/
  └── index.html              # Main Page
/src/styles
  └── index.css               # Tailwind CSS and custom styles
README.md
package.json

Dependencies

    React & React DOM

    Tailwind CSS for styling

    Pokémon TCG API

    lucide-react for loading spinner icons

Contributing

Feel free to open issues or submit pull requests for:

    Adding more card sets

    Better UI/UX improvements

    Performance optimizations

    Additional features like card details, shuffle animations, etc.

License

Acknowledgments

    Pokémon TCG API for card data

    Tailwind CSS & lucide-react for UI components




