---
title: "Flipping Tiles With Angular and Tailwind"
date: "2022-09-27"
heroImage: "/assets/tile_flip.gif"
heroImageAlt: "Demo of clicking square tiles to flip them over with a nice animation"
categories: 
  - "programming"
tags: 
  - "angular"
  - "css"
  - "tailwind"
---
I was recently brushing up on my Angular skills to prep for a job interview. As part of that I started building a memory match game where users flip tiles looking for matching pairs. I quickly became distracted figuring out how to get a nice tile flip animation before ending up with a pretty nice result.

Most of the styling is done with Tailwind. However, Tailwind has no support for the flipping transformation, so it was time to dive into some custom CSS.

# Game Board

I created a simple `Tile` interface to track the revealed color of the tile and if it is revealed right now.

```typescript
export interface Tile {
  color: string;
  isRevealed: boolean;
}
```

The game board itself is a centered 4x4 CSS grid. `tiles` is an array of 16 `Tile` objects. `onReveal()` contains game logic to check for matches, but isn't important for the tile flipping animation.

```html
<main class="container mx-auto">
    <h1 class="text-5xl font-bold text-center pb-5">Memory Match</h1>

    <div class="grid gap-4 grid-cols-4 grid-rows-4">
        <app-tile *ngFor="let tile of tiles" [tile]="tile" (revealed)="onReveal()"></app-tile>
    </div>
</main>
```

# Flipping Tiles

The look of each tile is defined entirely in Tailwind. In practice, it would be better to create a `TileFaceComponent` to abstract away the repetition on each inner div, but I chose not to do that while learning.

This is all standard Tailwind except for the `tile`, `facedown`, and `faceup` classes at the beginning of each div. Those are the hooks we need to flip our tiles. Both inner `div` elements are positioned absolutely, so they are directly on top of each other. Only one face will be visible at a time, which will be controlled through CSS.

```html
<div class="tile relative w-full h-full aspect-square shadow-md" [ngClass]="{ 'revealed': tile.isRevealed }" (click)="onClick()">
    <div class="facedown absolute w-full h-full flex items-center justify-center bg-slate-100 border-black border-2 rounded-md"></div>
    <div class="faceup absolute w-full h-full flex items-center justify-center border-black border-2 rounded-md" [style.background-color]="tile.color"></div>
</div>
```

Each tile is not revealed by default, which means I want to show the `facedown` div. When the user clicks the tile, the `onClick()` handler will fire, inverting `isRevealed` and emitting an event.

```typescript
export class TileComponent {
  @Input() tile!: Tile;
  @Output() revealed = new EventEmitter();

  onClick() {
    this.tile.isRevealed = !this.tile.isRevealed;
    this.revealed.emit();
  }
}
```

Now it's time to actually flip the tile through CSS. First, I set how long it takes to flip the tile with transition. Then, I set the [transform-style](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style) to `preserve-3d`, which is necessary to control how the child elements are positioned in 3D space.

```css
.tile  {
    transition: transform 0.6s;
    transform-style: preserve-3d;
}
```

Next, whenever a tile is revealed, I want to rotate it 180° on the Y-axis using [rotateY](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotateY). This gives the horizontal flip look I was going for. Setting [backface-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility) to hidden will hide the `div` for the other side of the tile. I rotated the `faceup` side 180° to start with so it is initially hidden. Now when the user clicks the tile, the `faceup` and `facedown` sides will swap. If `backface-visibility` was set to the default of `visible`, the user would still see the back side of the other div.

```css
.tile.revealed  {
    transform: rotateY(180deg);
}

.facedown, .faceup {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
}

.faceup {
    transform: rotateY(180deg);
}
```

And putting it all together gave me the nice animation I was looking for.

![Demo of clicking square tiles to flip them over with a nice animation](/assets/tile_flip.gif)

# Resources

These resources were extremely helpful to me when getting started.

- https://www.w3schools.com/howto/howto_css_flip_card.asp
- https://weekendprojects.dev/posts/5-flip-animation-css-examples/
