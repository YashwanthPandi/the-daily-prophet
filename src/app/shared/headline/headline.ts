import { Component, computed, input } from '@angular/core';

// Small "glue" words the prop papers set in little italic type between the
// big wood-type words: "DEMOTED FROM CHIEF WARLOCK in the WIZENGAMOT".
const MINOR_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'is', 'of', 'on',
  'or', 'the', 'to', 'vs', 'with',
]);

// ─────────────────────────────────────────────────────────────────────────────
// <app-headline text="..." /> prints a headline in the mixed-typeface style of
// the film props. The PARENT decides the main font and size (it just sets
// CSS on <app-headline>); this component only styles the small words.
//
// This one uses an inline `template` instead of a separate templateUrl file.
// Both work; inline is handy when the HTML is only a few lines long.
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-headline',
  template: `
    @for (word of words(); track $index) {
      <!-- The trailing space inside the span lets lines wrap between words. -->
      <span [class.minor]="word.minor">{{ word.text + ' ' }}</span>
    }
  `,
  styles: `
    .minor {
      font-family: var(--body);
      font-style: italic;
      font-weight: 400;
      text-transform: lowercase;
      font-size: 0.55em;
      letter-spacing: 0;
      vertical-align: 0.25em;
    }
  `,
})
export class Headline {
  readonly text = input.required<string>();

  /** "Rowling Writes for the Stage" → [{Rowling}, {Writes}, {for, minor}, {the, minor}, {Stage}] */
  readonly words = computed(() =>
    this.text()
      .split(/\s+/)
      .filter(Boolean)
      .map((text, index) => ({
        text,
        // Never shrink the FIRST word: "The Boy Who Lived" keeps a big "The".
        minor: index > 0 && MINOR_WORDS.has(text.toLowerCase().replace(/[^a-z]/g, '')),
      })),
  );
}
