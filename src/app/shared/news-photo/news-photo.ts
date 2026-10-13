import { Component, input, signal } from '@angular/core';

// A Daily Prophet "moving photograph": black-and-white, printed into the
// paper, and slowly drifting. If the image fails to load, the whole figure
// disappears instead of showing a broken-image icon.
@Component({
  selector: 'app-news-photo',
  templateUrl: './news-photo.html',
  styleUrl: './news-photo.scss',
  // `host` binds things onto the component's OWN element (<app-news-photo>).
  // Here: add the CSS class "fill" whenever the `fill` input is true, so the
  // stylesheet can target it with :host(.fill).
  host: { '[class.fill]': 'fill()', '[class.contain]': 'contain()' },
})
export class NewsPhoto {
  readonly src = input.required<string>();
  readonly caption = input('');
  /**
   * false (default): a fixed 16:10 picture.
   * true: stretch to whatever height the parent gives it — used by the
   * mosaic tiles, where each tile shape has a different height.
   */
  readonly fill = input(false);
  /**
   * true: show the WHOLE image, letterboxed, instead of cropping it to fill
   * the frame. For illustrations (potion bottles) that mustn't be cut off.
   */
  readonly contain = input(false);

  // Local UI state, flipped by the <img>'s (error) event.
  readonly failed = signal(false);
}
